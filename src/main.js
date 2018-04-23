// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'

import './css/public_reset.css'
import './css/public_main.css'
import './font/iconfont.css'

import './js/zepto.js'

import {myFn} from './js/main.js'
import {apiAddress} from './js/apiAddress.js'

window.myFn = myFn;
window.apiAddress = apiAddress;
window.is_inroom = false;
Vue.use(MintUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
window.vm = new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
