const glob = require('glob');
const path = require('path');
const fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin')

// 生成所有入口文件函数
function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function (entry) {


    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
    console.log(`${pathname}`+'============'+`${tmp}`+'================='+`${entry}`)
  });
  // console.log('getEntry==',entries);
  return entries;
}


module.exports.getJSEntry=function(globPath) {
  var entrys=getEntry(globPath);
  console.log('< 入口配置：','===',entrys)
  return entrys;
}


module.exports.getHTMLEntry=function(globPath) {
  if(!globPath)return [];

  var pages =  getEntry(globPath);
  var htmls=[];
  for (var pathname in pages) {


    var conf={
      filename: pages[pathname].replace('./src','server/views'),//输出
      template: pages[pathname],   // 源模板路径
      chunks: [pathname+'-main', 'vendor', 'manifest'], // 每个html引用的js模块 需要引入的Chunk，不配置就会引入所有页面的资源
      inject: true,
      title: 'Development',
      // chunksSortMode: 'dependency',
      minify: { //压缩HTML文件
               removeComments: true, //移除HTML中的注释
               collapseWhitespace: false //删除空白符与换行符
              }
    };
      console.log('< 载体页面配置：','===',conf)

    let plugin = new HtmlWebpackPlugin(conf);
    htmls.push(plugin);
  }

  return htmls;
}
