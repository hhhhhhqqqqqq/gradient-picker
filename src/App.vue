<template>
  <div id="app">
    <MsGradientPicker
      class="p"
      @change="change"
      :singer-predefine="singerPredefine"
      :gradient-predefine="gradientPredefine"
      type=""
      :value="color"
    ></MsGradientPicker>
  </div>
</template>

<script>
import MsGradientPicker from "./components/MsGradientPicker";
import { DefaultColor } from './utils/utils'
export default {
  name: "App",
  components: {
    MsGradientPicker
  },
  methods: {
    change(option) {
      console.log("option", option);
    }
  },
  data() {
    return {
      color: "",
      singerPredefine: [
    
      ],
      gradientPredefine: DefaultColor
    };
  },
  watch: {
    color() {
      console.log("this.color", this.color);
    }
  }
};
</script>

<style>
html,
body {
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
  bottom: 0;
  right: 200px;
}
</style>
