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
			rewardTimer: null
		};
	},
	methods: {
		init() {
			console.log("初始化")
			this.message = '等待点名';
			this.rewardMessage = '等待抽奖';
			this.title = '开始抽奖';
			this.rewards = [];
			this.running = false;
			let config = this.$db.get('config').value();
			let result = this.$db.get('result.RollCallReward').value();
			
			let users = this.$db.get('users').value();
			users.forEach(item => {
				this.users.push(item.name);
			});

			let rewards = this.$db.get('rewards').value();
			rewards.forEach(item => {
				if (config.rollreward == 2 && result.length > 0) {
					if (userResult.indexOf(item.name) != -1) {
						this.rewards.push(item.name);
					}
				} else {
					this.rewards.push(item.name);
				}
			});

			if (this.timer != null) {
				clearInterval(this.timer);
				this.timer = null;
			}

			if (this.rewardTimer != null) {
				clearInterval(this.rewardTimer);
				this.rewardTimer = null;
			}
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
						_this.rewardMessage = _this.rewards[rewardNum];
					}, 30);
				} else {
					clearInterval(this.timer);
					this.timer = null;
					let number = Math.floor(Math.random() * _this.users.length);
					_this.message = _this.users[number];

					clearInterval(this.rewardTimer);
					let rewardNum = Math.floor(Math.random() * _this.rewards.length);
					_this.rewardMessage = _this.rewards[rewardNum];

					this.$db
						.get('result.RollCallReward')
						.push(_this.rewardMessage)
						.write();

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
		top: 140px;
		right: 10px;
		height: 37px;
		cursor: pointer;
	}
	.box {
		width: 300px;
		height: 80px;
		background: #67c23a;
		font-size: 30px;
		text-align: center;
		line-height: 80px;
		color: #ffffff;
		border-radius: 10px;
		padding: 10px;
	}

	.box-1 {
		margin-top: 20px;
		width: 300px;
		height: 80px;
		background: #e6a23c;
		font-size: 30px;
		text-align: center;
		line-height: 80px;
		color: #ffffff;
		border-radius: 10px;
		padding: 10px;
	}

	.running-btn {
		margin-top: 20px;
		width: 320px;
	}
}
</style>
