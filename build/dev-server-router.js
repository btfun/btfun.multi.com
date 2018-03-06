let path = require('path');
let fs = require('fs');
let mkdirp = require('mkdirp');

module.exports = function(express, compiler){

  let router = express.Router();
  /**
  *********************************************
  *
  * 主路由命名空间
  *
  **********************************************
  */

  //主页路由
  router.get('/', (req, res) => {
  console.log('> =====进来了 home=============')
    util(res, 'home/home.html',{
      test:'success!!!'
    });

  });


  //主页路由
  router.get('/menu', (req, res) => {

    console.log('> =====进来了 menu=============')
      util(res, 'menu/menu.html',{
        test:'success!!!'
      });

  });




  var util=  (res, template, param) => {
    param=param||{};
    var env='dev';

    if (env == 'dev') {
//  'server/views/' 这个路径要跟 getHTMLEntry 入口文件配置相匹配
      let filename = compiler.outputPath  + 'server/views/'+template;
       //从内存中读取模板文件(webpackHtmlPlusn输出路径（注意相对路径，路径格式）)
      compiler.outputFileSystem.readFile(filename, function(err, result) {
        if(err){
          console.error( '> 错误信息：', err.code, err.path, err.message )
          res.locals.message = err.path + ' - '+ err.message;
          res.locals.error = err;
          res.status(404);
          res.render('error');
          return;
        }

        let fileInfo = path.parse(template); //载体页面路径

        mkdirp(fileInfo.dir, () => {
            //绝对路径 html文件 上级全路径  +  template 文件名
          var filedir=path.join(__dirname,'..', fileInfo.dir, fileInfo.base)
          //创建层次文件夹后，立即创建对应的文件
          fs.writeFileSync(filedir, result);
          //渲染输出
          res.render(template,param);
        });
      });
    } else {
      res.render(template,param);
    }
  }



  return router
};
