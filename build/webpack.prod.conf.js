var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

//******************编译优化****************************
// let ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
// let os = require('os');
// var HappyPack = require('happypack');
// var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
//******************编译优化****************************

var env = config.build.env
const entry = require('./entry');

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // new HappyPack({
    //     id: 'happybabel',
    //     loaders: ['babel-loader','html-loader','vue-loader'],
    //     threadPool: happyThreadPool,
    //     cache: true,
    //     verbose: true
    //   }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // new ParallelUglifyPlugin({ //多核压缩代码
    //   workerCount: os.cpus().length,
    //   cacheDir: '.cache/',
    //   uglifyJS: {
    //       compress: {
    //           warnings: false,
    //           drop_debugger: true,
    //           drop_console: true
    //       },
    //       // except: ['$', 'exports', 'require'], //排除关键字
    //       // comments: false,
    //       sourceMap: false,
    //       mangle: true
    //   }
    // }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      except: ['$', 'exports', 'require'], //排除关键字
      sourceMap: true
    }),
    // extract css into its own file
    //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', // 将公共模块提取，生成名为`vendors`的chunk
      // chunks: ['app','home','about'], //提取哪些模块共有的部分
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ].concat(entry.getHTMLEntry('./src/**/*.html')) //多入口
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
