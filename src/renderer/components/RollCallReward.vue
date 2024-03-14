<template>
	<div class="rollcall">
		<img src="../assets/back.png" class="back" @click="close" />
		<div class="box">{{ message }}</div>
		<div class="box-1">{{ rewardMessage }}</div>
		<el-button class="running-btn" size="mini" @click="start()">{{ title }}</el-button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			message: '等待点名',
			rewardMessage: '等待抽奖',
			title: '开始抽奖',
			users: [],
			rewards: [],
			running: false,
			timer: null,
			rewardTimer: null,
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
			console.log('初始化');
			this.message = '等待点名';
			this.rewardMessage = '等待抽奖';
			this.title = '开始抽奖';
			this.running = false;
			this.config = this.$db.get('config').value();
		
			let users = this.$db.get('users').value();
			users.forEach((item) => {
				this.users.push(item.name);
			});

			this.initData();

			if (this.timer != null) {
				clearInterval(this.timer);
				this.timer = null;
			}

			if (this.rewardTimer != null) {
				clearInterval(this.rewardTimer);
				this.rewardTimer = null;
			}
		},
		initData(){
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
			if (_this.rewards.length && _this.users.length) {
				if (!this.running) {
					this.running = true;
					this.$emit('on-run', this.running);
					this.title = '结束抽奖';
					this.timer = setInterval(() => {
						let num = Math.floor(Math.random() * _this.users.length);
						_this.message = _this.users[num];
					}, 30);

					this.rewardTimer = setInterval(() => {
						let rewardNum = Math.floor(Math.random() * _this.rewards.length);
						_this.rewardMessage = _this.rewards[rewardNum].name;
					}, 30);
				} else {
					clearInterval(this.timer);
					this.timer = null;
					let number = Math.floor(Math.random() * _this.users.length);
					_this.message = _this.users[number];

					clearInterval(this.rewardTimer);

					let rate = this.config.roll_call_rate ? this.config.roll_call_rate : 100;
					rate = parseInt(rate);
					rate = isNaN(rate) ? 100 : rate;
					const randomNumber = Math.floor(Math.random() * 100) + 1;

					if (randomNumber <= rate) {
						if (!_this.rewards.length) {
							_this.rewardMessage = '未抽中奖品';
						} else {
							let rewardNum = Math.floor(Math.random() * _this.rewards.length);
							let currentRewards = _this.rewards[number];
							_this.rewardMessage = currentRewards.name;

							this.$db
								.get('result.RollCallReward')
								.push(_this.message + '抽中' + _this.rewardMessage)
								.write();
							_this.$db
								.get('rewards')
								.find({ key: currentRewards.key })
								.assign({ num: currentRewards.num - 1 })
								.write();

							_this.initData();
						}
					} else {
						_this.rewardMessage = '未抽中奖品';
					}

					_this.title = '开始抽奖';
					_this.running = false;
					_this.$emit('on-run', this.running);
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
		height: 100px;
		background: #67c23a;
		font-size: 30px;
		text-align: center;
		color: #ffffff;
		border-radius: 10px;
		padding: 10px;
		width: 400px;
		overflow: hidden;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 80px;
	}

	.box-1 {
		margin-top: 20px;
		height: 100px;
		background: #e6a23c;
		font-size: 30px;
		text-align: center;
		color: #ffffff;
		border-radius: 10px;
		padding: 10px;
		width: 400px;
		overflow: hidden;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 80px;
	}

	.running-btn {
		margin-top: 20px;
		width: 400px;
	}
}
</style>
