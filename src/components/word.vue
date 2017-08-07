<template>
<div class="word">
  <ul>
    <li>{{msg}}</li>
    <li>{{msg2}}</li>
  </ul>

</div>

</template>

<script>
import api from '../base/api'


export default {
  name: 'word',
  created(){
    console.log('word 创建了',api)

    // this.$http.get('//www.baidu.com').then((res)=>{
    //   console.log(res)
    // },(res)=>{
    //   console.log('异常：',res)
    // })
  },
 activated() {
   console.log('每次都被执行')
 },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      msg2: 'zha zha'
    }
  }
}
</script>
<style lang="less" scoped>

.word{
font-size:38px;
ul{
  list-style: none;
  li{
    display: inline-block;
  }
}

}

</style>
