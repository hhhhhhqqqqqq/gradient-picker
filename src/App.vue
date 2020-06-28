<template>
  <div id="app">
    <MsGradientPicker class="p" @change="change" v-model="color"></MsGradientPicker>
  </div>
</template>

<script>
import MsGradientPicker from "./components/MsGradientPicker";

export default {
  name: "App",
  components: {
    MsGradientPicker
  },
  methods:{
    change(){}
  },
  data(){
    return {
      color:""
    }
  },
  watch:{
    color(){
      console.log('this.color', this.color)
    }
  }
};
</script>

<style>
html,body {
  height: 100%;
  width: 100%;
}
#app {
  position: relative;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
.p {
  position: absolute !important;
}
</style>
