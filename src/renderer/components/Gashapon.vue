<template>
	<div class="egg">
		<img src="../assets/back.png" class="back" @click="close" />
		<div class="game_qu">
			<div class="game_go" @click="start">
				<div>{{ title }}</div>
			</div>
			<div class="dan_gund">
				<span class="qiu_1" :class="ball1 ? 'weiyi_1' : 'diaol_1'"></span>
				<span class="qiu_2" :class="ball2 ? 'weiyi_2' : 'diaol_2'"></span>
				<span class="qiu_3" :class="ball3 ? 'weiyi_3' : 'diaol_3'"></span>
				<span class="qiu_4" :class="ball4 ? 'weiyi_4' : 'diaol_4'"></span>
				<span class="qiu_5" :class="ball5 ? 'weiyi_5' : 'diaol_5'"></span>
				<span class="qiu_6" :class="ball6 ? 'weiyi_6' : 'diaol_6'"></span>
				<span class="qiu_7" :class="ball7 ? 'weiyi_7' : 'diaol_7'"></span>
				<span class="qiu_8" :class="ball8 ? 'weiyi_8' : 'diaol_8'"></span>
				<span class="qiu_9" :class="ball9 ? 'weiyi_9' : 'diaol_9'"></span>
				<span class="qiu_10" :class="ball10 ? 'weiyi_10' : 'diaol_10'"></span>
			</div>

			<div class="medon"><img src="../assets/mendong.png" /></div>
			<div class="zjdl" :class="number != 0 ? 'dila_Y' : ''" v-show="number != 0">
				<span class="diaL_one" v-if="number == 1"></span>
				<span class="diaL_two" v-if="number == 2"></span>
				<span class="diaL_three" v-if="number == 3"></span>
				<span class="diaL_four" v-if="number == 4"></span>
			</div>
		</div>
		<el-dialog :visible.sync="dialogVisible" width="260px"><div class="digcontent" v-html="desc"></div></el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			title: 'GO',
			ball1: false,
			ball2: false,
			ball3: false,
			ball4: false,
			ball5: false,
			ball6: false,
			ball7: false,
			ball8: false,
			ball9: false,
			ball10: false,
			running: false,
			timer: null,
			number: 0,
			rewards: [],
			dialogVisible: false,
			desc: '咦？没有抽中？'
		};
	},
	methods: {
		init() {
			console.log('初始化');
			let config = this.$db.get('config').value();
			let result = this.$db.get('result.Gashapon').value();
			let rewards = this.$db.get('rewards').value();
			rewards.forEach(item => {
				if (config.rollreward == 2 && rewards.length > 0) {
					if (result.indexOf(item.name) != -1) {
						this.rewards.push(item.name);
					}
				} else {
					this.rewards.push(item.name);
				}
			});
		},
		close() {
			this.$nextTick(() => {
				this.$emit('on-close', {});
			});
		},
		start() {
			if (!this.running) {
				this.running = true;
				this.$emit('on-run', this.running);
				this.title = 'STOP';
				for (let i = 1; i <= 10; i++) {
					let key = 'ball' + i;
					this[key] = true;
				}
			} else {
				this.running = false;
				this.title = 'GO';
				for (let i = 1; i <= 10; i++) {
					let key = 'ball' + i;
					this[key] = false;
				}
				this.number = Math.floor(5 * Math.random() + 1);
				if (this.number == 5) {
					this.desc = '咦？没有抽中？';
				} else {
					let number = Math.floor(Math.random() * this.rewards.length);
					if (!this.rewards.length) {
						this.desc = '咦？没有抽中？';
					} else {
						this.desc = '恭喜你获得<br>' + this.rewards[number];
						this.$db
							.get('result.Gashapon')
							.push(this.rewards[number])
							.write();
					}
				}
				this.dialogVisible = true;
				setTimeout(() => {
					this.number = 0;
				}, 1000);
				this.$emit('on-run', this.running);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import './Egg.scss';
</style>
