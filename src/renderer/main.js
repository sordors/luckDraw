import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import path from 'path'
import Element from 'element-ui';
import '@/assets/style/index.scss';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Element);
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(path.join(__static, '/data.json'))
const db = low(adapter)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$http = axios
Vue.prototype.$db = db
Vue.config.productionTip = false

db.defaults({
	users: [],
	config: {
		"refresh": 1,
		"rollcall": 1,
		"rollreward": 1
	},
	rewards: {
		"RewardBox":[],
		"RollCall":[],
		"RollCallReward":[],
		"RollReward":[],
		"Gashapon":[]
	},
	result: []
}).write()

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
