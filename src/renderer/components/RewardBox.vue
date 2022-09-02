<template>
	<div class="rollcall">
		<img src="../assets/back.png" class="back" @click="close" />
		<div class="box">
			<div class="box-item" v-for="(item, index) in list" :key="index" @click="start(item)">
				<img src="../assets/caclose.png" alt="" :class="item.state ? 'caseopen' : ''" v-if="!item.open" />
				<img src="../assets/caopen.png" alt="" v-if="item.open" />
			</div>
		</div>

		<el-dialog :visible.sync="dialogVisible" width="260px"><div class="digcontent" v-html="desc"></div></el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					state: false,
					open: false
				},
				{
					state: false,
					open: false
				},
				{
					state: false,
					open: false
				},
				{
					state: false,
					open: false
				},
				{
					state: false,
					open: false
				},
				{
					state: false,
					open: false
				},
				{
					state: false,
					open: false
				},
				{
					state: false,
					open: false
				},
				{
					state: false,
					open: false
				}
			],
			count: 0,
			running: false,
			rewards: [],
			dialogVisible: false,
			desc: '咦？没有抽中？'
		};
	},
	methods: {
		init() {
			console.log('初始化');
			let config = this.$db.get('config').value();
			let result = this.$db.get('result.RewardBox').value();
			let rewards = this.$db.get('rewards').value();
			this.title = '开始抽奖';
			this.rewards = [];
			this.running = false;
			rewards.forEach(item => {
				if (config.rollreward == 2 && result.length > 0) {
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
		start(item) {
			let _this = this;
			item.state = true;
			if (!this.running) {
				this.running = true;
				this.$emit('on-run', this.running);
			}
			setTimeout(() => {
				item.state = false;
				item.open = true;
				_this.count = _this.count + 1;

				let reward = Math.floor(5 * Math.random() + 1);
				if (reward == 5) {
					_this.desc = '咦？没有抽中？';
				} else {
					let number = Math.floor(Math.random() * _this.rewards.length);
					if (!_this.rewards.length) {
						_this.desc = '咦？没有抽中？';
					} else {
						_this.desc = '恭喜你获得<br>' + _this.rewards[number];
						_this.$db
							.get('result.RewardBox')
							.push(_this.rewards[number])
							.write();
						_this.init();
					}
				}
				_this.dialogVisible = true;
			}, 1000);

			setTimeout(() => {
				if (this.count == 9) {
					this.count = 0;
					let list = [];
					this.list.forEach(item => {
						list.push({
							state: false,
							open: false
						});
					});
					this.list = list;
				}
			}, 2000);
		}
	}
};
</script>

<style lang="scss" scoped>
@keyframes mymove {
	from {
		transform: rotate(-15deg) scale(1.04);
	}
	to {
		transform: rotate(15deg) scale(0.97);
	}
}
.caseopen {
	animation: mymove 300ms linear 3;
}
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
		width: 600px;
		height: 440px;
		background: rgba(230, 162, 60, 0.56);
		font-size: 50px;
		text-align: center;
		line-height: 160px;
		color: #ffffff;
		border-radius: 10px;
		padding: 10px;
		.box-item {
			display: inline-block;
			width: 33.3%;
			img {
				width: 100px;
				cursor: pointer;
			}
		}
	}

	.running-btn {
		margin-top: 20px;
		width: 320px;
	}
}

.digcontent {
	font-size: 30px;
	color: #ff1a4b;
	text-align: center;
	height: 140px;

	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: -20px;
}
</style>
