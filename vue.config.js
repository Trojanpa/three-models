const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  filenameHashing: true,
  // 是否使用生产源映射，用于定位报错的代码位置，生产环境不需要可关闭，关闭可加速生产环境构建。
  productionSourceMap: isDevelopment,
  runtimeCompiler: true,
  // 是否转译依赖。默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。不过，对所有的依赖都进行转译可能会降低构建速度。如果对构建性能有所顾虑，你可以只转译部分特定的依赖：给本选项传一个数组，列出需要转译的第三方包包名或正则表达式即可。
  transpileDependencies: false,
  devServer: {
    host: 'localhost',
    https: false,
    port: 1212,
    open: true,
  },
});
