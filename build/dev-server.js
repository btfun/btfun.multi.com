require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  //强制开发模式
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}


var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var utils = require('./utils')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf') //加载DEV配置

var mkdirp = require('mkdirp');
let fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var template = require('art-template');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  // contentBase: "/path/to/directory",
  publicPath:  webpackConfig.output.publicPath, // 请求的根路径
  hot: true,
  noInfo: true,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())

// serve webpack bundle output /服务WebPACK束输出
app.use(devMiddleware)
// enable hot-reload and state-preserving  /启用热重新加载和状态保存
// compilation error display /编译错误显示
app.use(hotMiddleware)

//中间件方法  将base页面模块 其从内存中取得并存放到文件系统中。
// app.use((req, res, next) => {
//   let layoutPath = path.join(config.templateRoot, config.layoutTemplate);
//   let filename = compiler.outputPath + config.layoutTemplate;
//   //在渲染模板前需要将base页面模块 其从内存中取得并存放到文件系统中。
//   compiler.outputFileSystem.readFile(filename, function(err, result) {
//     let fileInfoLayout = path.parse(layoutPath);
//
//     console.log('fileInfoLayout',fileInfoLayout)
//
//     mkdirp(fileInfoLayout.dir, () => {
//       fs.writeFileSync(layoutPath, result);
//       next();
//     });
//   });
// });

// 视图引擎设置
template.config('base', '');
template.config('extname', '.html');
template.config('encoding', 'utf-8');
template.config('cache', false);
template.config('openTag', '[[');
template.config('closeTag', ']]');

app.engine('.html', template.__express);
app.set('views', path.join(__dirname, '../server/views')); //注意相对路径
app.set('view engine', 'html');
//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', require('./dev-server-router')(express,compiler));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// serve pure static assets 服务纯静态资产
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))



try {
    localhost = utils.getIPAdress()
  } catch (e) {
    localhost = 'localhost';
  }

var uri = `http://${localhost}:` + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port,(e)=>{
  console.log(`server start at ${port}`);
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
