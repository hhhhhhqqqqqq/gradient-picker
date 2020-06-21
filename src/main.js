import Vue from 'vue'
import App from './App.vue'
import {
  Tooltip,
  // ColorPicker,
  Tabs,
  TabPane,
  Button,
  InputNumber,
  // Slider
} from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
// Vue.use(Tooltip);
// Vue.use(ColorPicker);
// Vue.use(Tabs);
// Vue.use(TabPane);
// Vue.use(InputNumber);
// Vue.use(Button);
// Vue.use(Slider);

new Vue({
  render: h => h(App)
}).$mount('#app')