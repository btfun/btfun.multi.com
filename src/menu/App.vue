<template>
  <div id="app">

     <router-link to="/">Home</router-link>
     ||||
     <router-link to="/word">word</router-link>
     ||||
     <router-link to="/index">index</router-link>
    <span @click="art">{{name}}</span>

    <keep-alive include="word">
      <router-view ></router-view>
    </keep-alive>

  </div>
</template>

<script>
export default {
  name: 'app',
  beforeCreate(){
    console.log('创建之前')
  },
  created(){
    console.log('创建了')
  },
  data (){
    return {
      name:'小明'
    }
  },
  methods:{
    art(){
      console.log('打印出来了')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
