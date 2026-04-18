module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    /**
     * 如果h5编译生产环境是需要抽离css请将enable设为true
     * 注：抽离css后 hot reload 将不会生效 故默认不开启
     */
    miniCssExtractPluginOption: {
      ignoreOrder: true,
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css'
    },
  }
}