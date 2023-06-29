import MagicString from 'magic-string'
import { init, parse } from 'es-module-lexer'
import { isObject } from './utils'
import { emptyDirSync, ensureDir, ensureFile, writeFile } from 'fs-extra'
import path from 'path'
import { resolveOptions } from './options'
import { CACHE_DIR, NODE_MODULES_FLAG } from './constant'
import { transformImports, transformRequires } from './transform'

export const createTransformModuleName = (options) => {
    const transformModuleName = (externalValue) => {
        const { useWindow } = options
        if (useWindow === false) {
            return typeof externalValue === 'string' ? externalValue : externalValue.join('.')
        }
        if (typeof externalValue === 'string') {
            return `window['${externalValue}']`
        }
        const values = externalValue.map((val) => `['${val}']`).join('')
        return `window${values}`
    }
    return transformModuleName
}

export function viteExternalsPlugin(externals, userOptions) {
    let isBuild = false
    let isServe = false

    const options = resolveOptions(userOptions)
    const externalsKeys = Object.keys(externals)
    const isExternalEmpty = externalsKeys.length === 0

    const transformModuleName = createTransformModuleName(options)

    return {
        name: 'vite-plugin-externals',
        ...(userOptions.enforce ? { enforce: userOptions.enforce } : {}),
        async config(config, { command }) {
            isBuild = command === 'build'
            isServe = command === 'serve'

            if (!isServe) {
                return
            }
            if (options.disableInServe) {
                return
            }
            if (isExternalEmpty) {
                return
            }
            const newAlias = []
            const alias = config.resolve?.alias ?? {}
            if (isObject(alias)) {
                Object.keys(alias).forEach((aliasKey) => {
                    newAlias.push({ find: aliasKey, replacement: (alias)[aliasKey] })
                })
            } else if (Array.isArray(alias)) {
                newAlias.push(...alias)
            }

            const cachePath = path.join(process.cwd(), NODE_MODULES_FLAG, CACHE_DIR)
            await ensureDir(cachePath)
            await emptyDirSync(cachePath)

            for await (const externalKey of externalsKeys) {
                const externalCachePath = path.join(cachePath, `${externalKey}.js`)
                newAlias.push({ find: new RegExp(`^${externalKey}$`), replacement: externalCachePath })
                await ensureFile(externalCachePath)
                await writeFile(
                    externalCachePath,
                    `module.exports = ${transformModuleName(externals[externalKey])};`,
                )
            }

            return {
                resolve: {
                    alias: newAlias,
                },
            }
        },
        async transform(code, id, _options) {
            const ssr = compatSsrInOptions(_options)

            if (isServe && options.disableInServe) {
                return
            }
            if (!isNeedExternal.call(this, options, code, id, isBuild, ssr)) {
                return
            }
            let s
            let hasError = false
            try {
                if (isBuild && id.includes(NODE_MODULES_FLAG)) {
                    code = transformRequires(code, externals, transformModuleName)
                }
                await init
                const [imports] = parse(code)
                imports.forEach(({
                    d: dynamic,
                    n: dependence,
                    ss: statementStart,
                    se: statementEnd,
                }) => {
                    // filter dynamic import
                    if (dynamic !== -1) {
                        return
                    }

                    if (!dependence) {
                        return
                    }

                    const externalValue = externals[dependence]
                    if (!externalValue) {
                        return
                    }

                    s = s || (s = new MagicString(code))

                    const raw = code.substring(statementStart, statementEnd)
                    const newImportStr = transformImports(raw, externalValue, transformModuleName)
                    s.overwrite(statementStart, statementEnd, newImportStr)
                })
            } catch (error) {
                hasError = true
                if (userOptions.debug) {
                    console.error(error)
                }
            }
            if (hasError || !s) {
                return { code, map: null }
            }
            return {
                code: s.toString(),
                map: s.generateMap(Object.assign({}, {
                    source: id,
                    includeContent: true,
                    hires: true,
                }, userOptions.sourceMapOptions)),
            }
        },
    }
}

export function isNeedExternal(
    that,
    options,
    code,
    id,
    isBuild,
    ssr,
) {
    const {
        disableSsr = true,
        filter,
    } = options
    // filter ssr env
    if (disableSsr && ssr) {
        return false
    }

    return filter.call(this, code, id, ssr ?? false, isBuild)
}

function compatSsrInOptions(options) {
    if (typeof options === 'boolean') {
        return options
    }
    return options?.ssr ?? false
}