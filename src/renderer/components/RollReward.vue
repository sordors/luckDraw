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
			timer: null
		};
	},
	methods: {
		init() {
			console.log("init")
			this.message = '随机抽奖';
			this.title = '开始抽奖';
			this.rewards = [];
			this.running = false;
			let config = this.$db.get('config').value();
			let result = this.$db.get('result.RollReward').value();
			let rewards = this.$db.get('rewards').value();
			rewards.forEach(item => {
				if (config.rollreward == 2 && result.length > 0) {
					if (result.indexOf(item.name) != -1) {
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
		},
		close() {
			this.$nextTick(() => {
				this.$emit('on-close', {});
			});
		},
		start() {
			let _this = this;
			if (_this.rewards.length) {
				if (!this.running) {
					this.running = true;
					this.$emit('on-run', this.running);
					this.title = '结束抽奖';
					this.timer = setInterval(() => {
						let num = Math.floor(Math.random() * _this.rewards.length);
						_this.message = _this.rewards[num];
					}, 30);
				} else {
					this.running = false;
					this.title = '开始抽奖';
					clearInterval(this.timer);
					this.timer = null;
					let number = Math.floor(Math.random() * _this.rewards.length);
					_this.message = _this.rewards[number];
					this.$db
						.get('result.RollReward')
						.push(_this.message)
						.write();
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
		top: 140px;
		right: 10px;
		height: 37px;
		cursor: pointer;
	}
	.box {
		width: 300px;
		height: 160px;
		background: #67c23a;
		font-size: 50px;
		text-align: center;
		line-height: 160px;
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
