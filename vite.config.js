import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import { viteExternalsPlugin } from 'vite-plugin-externals'
// import pkg from "./package.json"
// import federation from './plugins/vite-plugin-react-federation';
import transformHtml from './plugins/vite-plugin-transform-html';


export default defineConfig({
  resolve: {
    alias: {
      "~/components": "client/components",
      "@": path.resolve('./client')
    }
  },
  build: {
    outDir: 'build/client',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
        format: 'iife'
      }
    },
  },
  plugins: [
    {
      ...viteExternalsPlugin({
        'react': 'React',
        'react-dom': 'ReactDOM',
        'antd': 'antd',
        'alova': 'alova',
        "_global": "window._global"
      }),
      apply: 'build'
    },
    react(),
    transformHtml()
  ],

})
