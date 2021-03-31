const path= require('path');
module.exports = {
  // lintOnSave: process.env.NODE_ENV !== 'production'
  // 打包时不生成很大的.map 文件
  productionSourceMap: false,

  publicPath: './', // cli3 中 assetsPublicPath 属性被 baseUrl 取代

  // 不校验es
  lintOnSave: false,

  css: {
    loaderOptions: {
      less: {
        // 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
        /*lessOptions: {
          modifyVars: {
            hack: `true; @import "${path.join(__dirname, './src/assets/less/theme.less')}";`,
          }
        }*/
        modifyVars: {
          /*'calendar-selected-day-background-color': '#16a1fe',*/
          hack: `true; @import "${path.join(__dirname, './src/assets/less/theme.less')}";`
        }
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/assets/less/theme.less')
      ]
    }
  }
}
