<template>
<div class="index6">
  <ul>
    <li>{{msg}}</li>
    <li>{{msg2}}</li>
  </ul>

</div>

</template>

<script>
export default {
  name: 'index6',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      msg2: 'index6  index6'
    }
  }
}
</script>
<style lang="less" scoped>
.index6{

ul{
  list-style: none;
  li{
    display: inline-block;
  }
}

}

</style>
