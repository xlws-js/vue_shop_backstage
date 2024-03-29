import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'assets/fonts/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.$toast = ElementUi.Message

Vue.use( ElementUi )

new Vue( {
  router,
  render: h => h( App )
} ).$mount( '#app' )
