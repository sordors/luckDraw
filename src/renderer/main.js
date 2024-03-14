import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import path from 'path'
import Element from 'element-ui';
import '@/assets/style/index.scss';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/lib/tagcanvas.js';

Vue.use(Element);
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(path.join(__static, '/data.json'))
const db = low(adapter)

const subjectAdapter = new FileSync(path.join(__static, '/subject.json'))
const subjectDb = low(subjectAdapter)


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$http = axios
Vue.prototype.$db = db
Vue.prototype.$subjectDb = subjectDb
Vue.config.productionTip = false

db.defaults({
	users: [],
	config: {
		"refresh": 1,
		"rollcall": 1,
		"time": 30,
		"roll_integral": 0,
		"roll_rate": 100,
		"egg_integral": 0,
		"egg_rate": 100,
		"box_integral": 0,
		"box_rate": 100,
		"cool_integral": 0,
		"cool_rate": 100
	},
	rewards: [],
	result: {
		"RewardBox": [],
		"RollCall": [],
		"RollCallReward": [],
		"RollReward": [],
		"Gashapon": [],
		"RollBall": []
	},
	rank: []
}).write()

subjectDb.defaults({
	data: []
}).write()

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
