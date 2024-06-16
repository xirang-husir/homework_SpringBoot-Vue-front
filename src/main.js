// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)


import axios from "axios";
// 设置服务器访问路径前缀
axios.defaults.baseURL = "http://localhost:9001/";
// 设置请求体
axios.defaults.headers.post["Content-Type"] = 'application/json';
// 设置put请求体
axios.defaults.headers.put['Content-Type']='application/json'
// 设置全局axios的写法
Vue.prototype.$axios = axios

// 设置图片访问的路径前缀
Vue.prototype.$imageUrl = 'http://localhost:9001/images/'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
