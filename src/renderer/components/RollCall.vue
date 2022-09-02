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
			message: '随机点名',
			title: '开始点名',
			users: [],
			running: false,
			timer: null
		};
	},
	methods: {
		init() {
			console.log('初始化');
			this.message = '随机点名';
			this.title = '开始点名';
			this.users = [];
			this.running = false;
			let config = this.$db.get('config').value();
			let result = this.$db.get('result.RollCall').value();

			let users = this.$db.get('users').value();
			users.forEach(item => {
				if (config.rollreward == 2 && result.length > 0) {
					if (result.indexOf(item.name) != -1) {
						this.users.push(item.name);
					}
				} else {
					this.users.push(item.name);
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
			if (_this.users.length) {
				if (!this.running) {
					this.running = true;
					this.$emit('on-run', this.running);
					this.title = '结束点名';
					this.timer = setInterval(() => {
						let num = Math.floor(Math.random() * _this.users.length);
						_this.message = _this.users[num];
					}, 30);
				} else {
					this.running = false;
					this.title = '开始点名';
					clearInterval(this.timer);
					this.timer = null;
					let number = Math.floor(Math.random() * _this.users.length);
					_this.message = _this.users[number];
					this.$db
						.get('result.RollCall')
						.push(_this.message)
						.write();
					this.$emit('on-run', this.running);
				}
			} else {
				this.$message.error('没有可以点名的人了');
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
		width: 100%;
		height: 160px;
		background: #e6a23c;
		font-size: 50px;
		text-align: center;
		line-height: 160px;
		color: #ffffff;
		border-radius: 10px;
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.running-btn {
		margin-top: 20px;
		width: 320px;
	}
}
</style>
