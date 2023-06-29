import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
const favicon = require("serve-favicon")
const express = require("express")
const fs = require('fs')
const colors = require('colors');
const path = require('path')
var figlet = require('figlet');
const { createServer: createViteServer } = require('vite')


async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production'
  const env = process.env.NODE_ENV || 'development'
  const resolve = (p: any) => path.resolve(__dirname, p)
  const server = new ExpressAdapter(express())
  const port = process.env.PORT || 3002

  //读取index页面模版
  const indexProd = isProd ? fs.readFileSync(resolve('../client/index.html'), 'utf-8') : ''
  const app = await NestFactory.create(AppModule, server, {
    bodyParser: true,
    cors: true,
  },);
  app.setGlobalPrefix('/api'); //与 setBasePath 自动填充 

  let vite;
  if (!isProd) {
    vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100
        }
      },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    app.use(require('compression')())
    app.use(
      require('serve-static')(resolve('../client'), {
        index: false
      })
    )
  }

  //阿波罗配置
  let apolloResult = {} //await apollo({ appId: 'vite-cli' })

  //favicon.ico 拦截
  server.use(favicon(path.resolve(process.cwd(), 'client/static/favicon.svg')));

  server.get(/^(?!\/api\/)/, async (req, res) => {
    try {
      const url = req.originalUrl;
      let template;
      let scriptlib = ""
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = indexProd;
        scriptlib = `<script src="http://${req.hostname}:8089/npmlib/??polyfill.js,react/umd/react.production.min.js,react-dom/umd/react-dom.production.min.js,dayjs/dayjs.min.js,antd/dist/antd.min.js,alova/dist/alova.umd.min.js"></script>`
      }
      template = template.replace(
        '<!--@placeholder-->',
        `${scriptlib}
        <script>
          window._global = { apollo:${JSON.stringify(
          apolloResult,
        )} ,auth:${JSON.stringify(req.authResult)}}
      </script>`,
      );
      res
        .status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(template);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      res.status(500).end(e.stack);
    }
  });


  app.listen(port, () => {
    figlet('welcome!', function (err, data) {
      if (err) {
        console.dir(err);
        return;
      }
      console.log(colors.yellow(data));
      console.log(colors.blue(`访问首页:  http://localhost:${port}`));
      // if (env === "development") {
      //   let lowCodePage = initLowPage({ env })
      //   console.log(colors.red('创建页面:  http://localhost:' + port + lowCodePage))
      // }
    });
  })
}

bootstrap()
