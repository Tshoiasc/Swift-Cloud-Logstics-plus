import App from './App'
import store from './store'
import i18n from './lang/i18n'
import tui from './common/httpRequest'
// #ifdef H5
window.QQmap = null;
// #endif

// #ifndef VUE3
import Vue from 'vue';
import uView from "@/uni_modules/uview-ui";
Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.tui = tui
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
// #endif


// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	app.config.globalProperties.tui = tui;
	return {app}
}
// #endif
