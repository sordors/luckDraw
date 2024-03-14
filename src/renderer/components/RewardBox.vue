<template>
	<div class="rollcall">
		<img src="../assets/back.png" class="back" @click="close" />
		<div class="box">
			<div class="box-item" v-for="(item, index) in list" :key="index" @click="start(item)">
				<!-- <img src="../assets/caclose.png" alt="" :class="item.state ? 'caseopen' : ''" v-if="!item.open" />
				<img src="../assets/caopen.png" alt="" v-if="item.open" /> -->
				<img src="../assets/un-open-box.png" class="close" alt="" :class="item.state ? 'caseopen' : ''"
					v-if="!item.open" />
				<img src="../assets/opend.png" alt="" v-if="item.open" class="open" />
			</div>
		</div>

		<el-dialog :visible.sync="dialogVisible" width="300px">
			<div class="digcontent" v-html="desc"></div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
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
				desc: '咦？没有抽中？',
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
				this.config = this.$db.get('config').value();
				let rewards = this.$db.get('rewards').value();

				this.title = '开始抽奖';
				this.rewards = [];
				rewards.forEach((item) => {
					if (item.num > 0) {
						this.rewards.push(item);
					}
				});
				console.log(this.rewards);
				this.running = false;
			},
			close() {
				this.$nextTick(() => {
					this.$emit('on-close', {});
				});
			},
			start(item) {
				let _this = this;
				let integral = _this.config.box_integral ? _this.config.box_integral : 0;
				integral = parseInt(integral);
				integral = isNaN(integral) ? 0 : integral;

				if (_this.user && integral > 0 && _this.user.integral < integral) {
					_this.desc = '😭积分不足！';
					_this.dialogVisible = true;
					return;
				}

				if (!_this.rewards.length) {
					this.desc = '😭没有奖品了！';
					_this.dialogVisible = true;
					return;
				}

				item.state = true;
				if (!this.running) {
					this.running = true;
					this.$emit('on-run', this.running);
				}



				setTimeout(() => {
					item.state = false;
					item.open = true;
					_this.count = _this.count + 1;

					let rate = this.config.box_rate ? this.config.box_rate : 100;
					rate = parseInt(rate);
					rate = isNaN(rate) ? 100 : rate;
					const randomNumber = Math.floor(Math.random() * 100) + 1;

					if (randomNumber <= rate && _this.rewards.length) {
						let number = Math.floor(Math.random() * _this.rewards.length);
						let currentRewards = _this.rewards[number];
						_this.desc = '😃恭喜你获得<br>' + currentRewards.name;
						let ballResult = _this.user ? _this.user.name + '抽中' + currentRewards.name : currentRewards
							.name;
						_this.$db.get('result.RewardBox').push(ballResult).write();
						_this.$db
							.get('rewards')
							.find({
								key: currentRewards.key
							})
							.assign({
								num: currentRewards.num - 1
							})
							.write();

						_this.init();
					} else {
						this.desc = '😭咦？没有抽中？';
					}

					_this.dialogVisible = true;
				}, 1000);

				setTimeout(() => {
					if (this.count == 9) {
						this.count = 0;
						let list = [];
						this.list.forEach((item) => {
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
			width: 800px;
			height: 600px;
			background: rgba(230, 162, 60, 0.56);
			font-size: 50px;
			text-align: center;
			color: #ffffff;
			border-radius: 10px;
			padding: 10px;

			.box-item {
				display: inline-block;
				width: 33.3%;
				height: 200px;
				overflow: hidden;
				.close {
					width: 90%;
					margin-left: 0;
					margin-top: -40px;
					cursor: pointer;
				}

				.open {
					width: 100%;
					cursor: pointer;
					margin-top: -70px;
					margin-left: -30px;
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