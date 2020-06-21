<template>
  <div id="app">
    <MsGradientPicker class="p"></MsGradientPicker>
  </div>
</template>

<script>
import MsGradientPicker from "./components/MsGradientPicker";

export default {
  name: "App",
  components: {
    MsGradientPicker
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
