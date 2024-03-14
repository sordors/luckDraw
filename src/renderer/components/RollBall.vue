<template>
	<div class="rollball">
		<img src="../assets/back.png" class="back" @click="close" />
		<div id="tags">
			<ul v-for="item in data" :key="item.key">
				<a href="javascript:void(0);">{{ item.name }}</a>
			</ul>
		</div>
		<div id="box" class="box"></div>

		<el-button class="run-btn" type="primary" @click="start">{{ title }}</el-button>

		<el-dialog :visible.sync="dialogVisible" width="300px"><div class="digcontent" v-html="desc"></div></el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			title: '开始抽奖',
			rewards: [],
			data: [],
			running: false,
			timer: null,
			dialogVisible: false,
			desc: '咦？没有抽中？',
			config: null,
			canvas: null
		};
	},
	computed: {
		user() {
			return this.$store.state.user.data;
		}
	},
	methods: {
		init() {
			this.initData();
			this.$nextTick(() => {
				this.startTagCanvas();
			});
		},
		initData() {
			this.config = this.$db.get('config').value();
			this.data = this.$db.get('rewards').value();
			let result = this.$db.get('result.RollBall').value();
			this.rewards = [];
			this.data.forEach((item) => {
				if (item.num > 0) {
					this.rewards.push(item);
				}
			});
		},
		speed() {
			return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
		},
		createCanvas() {
			if (this.canvas) {
				this.$el.querySelector('#box').removeChild(this.canvas);
			}

			this.canvas = document.createElement('canvas');
			this.canvas.width = 500;
			this.canvas.height = 500;
			this.canvas.id = 'rootcanvas';
			this.$el.querySelector('#box').appendChild(this.canvas);
		},
		startTagCanvas() {
			this.createCanvas();
			const { speed } = this;
			window.TagCanvas.Start('rootcanvas', 'tags', {
				textColour: '#ffffff',
				initial: speed(),
				dragControl: 1,
				decel: 0.5,
				textHeight: 16,
				minSpeed: 0.01,
				noSelect: true
			});
		},
		reloadTagCanvas() {
			window.TagCanvas.Reload('rootcanvas');
		},
		close() {
			this.$nextTick(() => {
				this.$emit('on-close', {});
			});
		},
		start() {
			let _this = this;
			let integral = _this.config.cool_integral ? _this.config.cool_integral : 0;
			integral = parseInt(integral);
			integral = isNaN(integral) ? 0 : integral;

			if (_this.user && integral > 0 && _this.user.integral < integral) {
				_this.desc = '😭积分不足！';
				_this.dialogVisible = true;
				return;
			}

			if (_this.rewards.length) {
				if (!this.running) {
					this.running = true;
					this.$emit('on-run', this.running);
					this.title = '结束抽奖';
					window.TagCanvas.SetSpeed('rootcanvas', [5, 1]);
				} else {
					this.running = false;
					this.title = '开始抽奖';
					let number = Math.floor(Math.random() * _this.rewards.length);

					window.TagCanvas.SetSpeed('rootcanvas', this.speed());
					this.$nextTick(() => {
						this.reloadTagCanvas();
					});

					let rate = this.config.cool_rate ? this.config.cool_rate : 100;
					rate = parseInt(rate);
					rate = isNaN(rate) ? 100 : rate;
					const randomNumber = Math.floor(Math.random() * 100) + 1;

					if (randomNumber <= rate) {
						let currentRewards = _this.rewards[number];
						_this.desc = '😃恭喜你获得<br>' + currentRewards.name;
						let ballResult = _this.user ? _this.user.name + '抽中' + currentRewards.name : currentRewards.name;
						_this.$db
							.get('result.RollBall')
							.push(ballResult)
							.write();
						_this.$db
							.get('rewards')
							.find({ key: currentRewards.key })
							.assign({ num: currentRewards.num - 1 })
							.write();
						
						_this.init();
					} else {
						_this.desc = '😭咦？没有抽中？';
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

					_this.dialogVisible = true;
					this.$emit('on-run', this.running);
				}
			} else {
				_this.desc = '😭奖池已空！！！';
				_this.dialogVisible = true;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.rollball {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 100%;
	.back {
		position: absolute;
		top: 240px;
		right: 15px;
		height: 37px;
		cursor: pointer;
	}
	.box {
		width: 80%;
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.run-btn {
		position: absolute;
		top: 480px;
		right: 15px;
		height: 37px;
	}
}

.digcontent {
	font-size: 24px;
	color: #e6a23c;
	text-align: center;
	height: 140px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: -20px;
}
</style>
