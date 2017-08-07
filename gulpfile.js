var gulp        = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var glob = require('glob');
var os = require('os');
var path = require('path');

// 静态服务器
gulp.task('server', function() {
    browserSync.init({
      port:8888,
      browser: 'chrome',
      notify: false,
      server: {
          baseDir: "./dist",
      }
    });

});


function getIPAdress(){
    var interfaces = os.networkInterfaces();
    for(var devName in interfaces){
          var iface = interfaces[devName];
          for(var i=0;i<iface.length;i++){
               var alias = iface[i];
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                     return alias.address;
               }
          }
    }
}

function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });
  console.log(entries);
  return entries;
}
gulp.task('default', function() {

  getEntry('./src/**/main.js')
})
// 静态服务器 + 监听 scss/html 文件

gulp.task('server2',function(cb){
  var started=false;

    nodemon({
        ignore:['gulpfile.js','./node_modules/','./src/','./dist/'], //忽略不需要监视重启的文件 ,
        script: 'server/bin/btfun'
    }).on('start',function(){
      if (!started) {
        started = true;
        browserSync.init({
            files: ['./views/**/*.*'], //, './public/**/*.*'（和浏览器注入脚本不能同事使用）
            proxy: 'http://'+getIPAdress()+':3066/', //设置代理运行本地的3000端口
            port: 8066,
            browser: 'chrome',
            notify: false
        },function(){
            console.log('浏览器已刷新')
        })
      }
    });


})
