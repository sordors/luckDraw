<template>
	<div class="rollcall">
		<img src="../assets/back.png" class="back" @click="close" />
		<div class="box">{{ message }}</div>
		<el-button class="running-btn" size="mini" @click="start()">{{ title }}</el-button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			message: '随机抽奖',
			title: '开始抽奖',
			rewards: [],
			running: false,
			timer: null,
			config: null
		};
	},
	computed: {
		user() {
			return this.$store.state.user.data;
		}
	},
	methods: {
		init() {
			console.log('init');
			this.message = '随机抽奖';
			this.title = '开始抽奖';
			this.running = false;
			this.config = this.$db.get('config').value();
			this.initData();

			if (this.timer != null) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		initData() {
			this.rewards = [];
			let rewards = this.$db.get('rewards').value();
			rewards.forEach((item) => {
				if (item.num > 0) {
					this.rewards.push(item);
				}
			});
		},
		close() {
			this.$nextTick(() => {
				this.$emit('on-close', {});
			});
		},
		start() {
			let _this = this;
			let integral = _this.config.roll_integral ? _this.config.roll_integral : 0;
			integral = parseInt(integral);
			integral = isNaN(integral) ? 0 : integral;

			if (_this.user && integral > 0 && _this.user.integral < integral) {
				this.$message.error('积分不足');
				return;
			}

			if (_this.rewards.length) {
				if (!this.running) {
					this.running = true;
					this.$emit('on-run', this.running);
					this.title = '结束抽奖';
					this.timer = setInterval(() => {
						let num = Math.floor(Math.random() * _this.rewards.length);
						_this.message = _this.rewards[num].name;
					}, 30);
				} else {
					this.running = false;
					this.title = '开始抽奖';
					clearInterval(this.timer);
					this.timer = null;

					let rate = this.config.roll_rate ? this.config.roll_rate : 100;
					rate = parseInt(rate);
					rate = isNaN(rate) ? 100 : rate;
					const randomNumber = Math.floor(Math.random() * 100) + 1;

					if (randomNumber <= rate) {
						let number = Math.floor(Math.random() * this.rewards.length);
						let currentRewards = this.rewards[number];
						this.message = currentRewards.name;
						let ballResult = this.user ? this.user.name + '抽中' + currentRewards.name : currentRewards.name;

						this.$db.get('result.RollReward').push(ballResult).write();
						this.$db
							.get('rewards')
							.find({ key: currentRewards.key })
							.assign({ num: currentRewards.num - 1 })
							.write();

						this.initData();
					} else {
						this.message = '未抽中奖品';
					}
					
					//扣除当前用户积分，如果有用户的情况下
					if (_this.user && integral > 0 && _this.user.integral >= integral) {
						let newIntegral = parseInt(_this.user.integral) - parseInt(integral);
						this.$db.get('users').find({ key: _this.user.key }).assign({ integral: newIntegral }).write();
						//更新当前用户信息
						let user = Object.assign({}, _this.user);
						user.integral = newIntegral;
						this.$store.commit('ADD_USER', user);
					}
					
					this.$emit('on-run', this.running);
				}
			} else {
				this.$message.error('没有可以抽取的奖励了');
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.rollcall {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.back {
		position: absolute;
		top: 240px;
		right: 15px;
		height: 37px;
		cursor: pointer;
	}
	.box {
		height: 160px;
		background: #67c23a;
		font-size: 40px;
		text-align: center;
		line-height: 140px;
		color: #ffffff;
		border-radius: 10px;
		padding: 10px;
		width: 400px;
		overflow: hidden;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.running-btn {
		margin-top: 20px;
		width: 400px;
	}
}
</style>
