
export default function htmlPlugin() {
  let isProd = process.env.NODE_ENV === 'production'
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      if(!isProd){
        html =  html.replace(/(react(-dom)?).production.min/g,`$1.development`)
      }
      return html
    }
  }
}