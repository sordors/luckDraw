<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'luck',
	created() {
	}
  }
</script>

<style>
  #app {
  	height: 100%;
	width: 100%;
  }
  @font-face {
      font-family: 'myFont';
      src: url('./assets/TTENuoJ_0.ttf') format('truetype');
  }
  
  * {
      font-family: "myFont";
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
  }
</style>
