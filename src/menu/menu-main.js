import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
/**
* 程序主入口
*
**/
Vue.config.productionTip = false

Vue.use(VueResource)


/**
  *  路由拦截
  *
  **/
router.beforeEach((to, from, next) => {
  console.log('当前路径：',to.path)
  next()
});

/**
  *  请求拦截
  *
  **/
Vue.http.options.emulateJSON = true;
// Vue.http.options.emulateHTTP = true;
Vue.http.interceptors.push((request, next) => {
  console.log('拦截url：',request.url,'参数：',request.params)
    var timeout=setTimeout(()=>{
    request.abort();//打断请求
    next(request.respondWith(request.body, {
         status: 408,
         statusText: '请求超时或链接异常'
    }));
  }, Number(request.timeout||0)||2000);

    next((response) => {
      clearTimeout(timeout);
      return response;
    })
});


/**
  *  end:挂载实例
  *
  **/
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
