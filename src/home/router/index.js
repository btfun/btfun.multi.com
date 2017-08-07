import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
// import word from '@/components/word'
// import index from '@/components/index/index'

Vue.use(Router)

//路由配置文件
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/word',
      name: 'word',
      // component: index,
      component: resolve => require(['@/components/word'],resolve),
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/index',
      name: 'index',
      // component: index,
      component: resolve => require(['@/components/index/index'],resolve),
      meta: {
        keepAlive: false // 需要被缓存
      }
    }
  ]
})
