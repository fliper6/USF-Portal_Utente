import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false

const moment = require('moment')
require('moment/locale/pt')

Vue.use(require('vue-moment'), {
  moment
})

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA5kyfRJ3rWkg9xECVwrkSWLIEK5rClmr8',
    libraries: 'places', 
  },
  installComponents: true
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
