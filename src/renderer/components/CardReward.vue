<template>
	<div class="main">
		<div class="card-header">
			<div class="header-left">
				<el-button class="user-btn" type="text" @click="chooseUser()">
					{{ user ? '姓名：' + user.name + '，'+ (config && config.integral_nikcname ? config.integral_nikcname : '积分') +'：' + user.integral + '，点击重选' : '选择用户' }}
				</el-button>
			</div>
			<div class="header-right">
				<el-button class="header-btn btn-3" type="text" @click="openUsers()">名单配置</el-button>
				<el-button class="header-btn btn-4" type="text" @click="openRewards()">奖项配置</el-button>
				<el-button class="header-btn btn-4" type="text" @click="openBaseRewards()">保底奖励</el-button>
				<el-button class="header-btn btn-3" type="text" @click="openResult()">抽奖结果</el-button>
				<el-button class="header-btn btn-1" type="text" @click="openConfig()">系统配置</el-button>
			</div>
		</div>
		<img src="../assets/voice_close.png" class="voice" @click="voiceChage(true)" v-if="!voice" />
		<img src="../assets/voice_open.png" class="voice" @click="voiceChage(false)" v-if="voice" />
		<img src="../assets/back.png" class="back" @click="close" />
		<div class="content">
			<div class="grid">
				<div class="grid-left">
					<div class="project" :class="item.class" v-for="(item, index) in list" :key="index">
						<div class="mask">
							<div class="back">{{ item.reward }}</div>
							<div class="front"><span></span></div>
						</div>
					</div>
				</div>
				<div class="grid-right">
					<div class="aniwz">
						<div class="text">
							抽奖
							<br />
							游戏
						</div>
					</div>
					<div class="controls" @click.stop="start">
						<span class="bottom"></span>
						<span class="bottom"></span>
						<span class="bottom"></span>
						<div class="mask">
							<div class="text start">
								<span>{{ run ? '重置' : '开始' }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Challenge ref="challenge"></Challenge>
		<Config ref="config" @on-reset="reset"></Config>
		<Result ref="result"></Result>
		<UserList ref="users"></UserList>
		<RewardList ref="rewards" @on-reset="init"></RewardList>
		<BaseRewards ref="basereward" @on-reset="init"></BaseRewards>
		<audio id="audiobg" preload="auto" controls autoplay loop @play="playHandler" @pause="pauseHandler" style="display: none">
			<source :src="audioSrc" />
			你的浏览器不支持audio标签
		</audio>
		<el-dialog :visible.sync="dialogVisible" width="300px">
			<div class="digcontent" v-html="desc"></div>
		</el-dialog>
		<span class="copy-right">软件作者：Sordors</span>
	</div>
</template>

<script>
import Names from './Names';
import UserList from './UserList';
import Result from './Result';
import Config from './Config';
import Challenge from './Challenge';
import RewardList from './RewardList';
import BaseRewards from './BaseRewards';
import bgaudio from '@/assets/before.mp3';
export default {
	components: {
		Names,
		Challenge,
		Config,
		UserList,
		RewardList,
		Result,
		BaseRewards
	},
	computed: {
		user() {
			return this.$store.state.user.data;
		}
	},
	data() {
		return {
			voice: false,
			audioSrc: bgaudio,
			list: [
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				},
				{
					reward: '',
					class: ''
				}
			],
			run: false,
			config: null,
			rewards: [],
			base_rewards: [],
			desc: '咦？没有抽中？',
			dialogVisible: false
		};
	},
	created() {
		this.init();
	},
	mounted() {
		this.voiceChage(false);
	},
	methods: {
		init() {
			this.config = this.$db.get('config').value();
			let rewards = this.$db.get('rewards').value();
			this.base_rewards = this.$db.get('base_rewards').value();
			this.rewards = [];
			rewards.forEach((item) => {
				if (item.num > 0) {
					this.rewards.push(item);
				}
			});
		},
		playHandler() {
			this.voice = true;
		},
		pauseHandler() {
			this.voice = false;
		},
		voiceChage(state) {
			this.voice = state;
			if (state) {
				this.$el.querySelector('#audiobg').play();
			} else {
				this.$el.querySelector('#audiobg').pause();
			}
		},
		close() {
			this.$router.go(-1);
		},
		openResult() {
			this.$refs.result.open();
		},
		reset() {
			this.config = this.$db.get('config').value();
		},
		openBaseRewards() {
			this.$refs.basereward.open();
		},
		openRewards() {
			this.$refs.rewards.open();
		},
		openUsers() {
			this.$refs.users.open();
		},
		chooseUser() {
			this.$refs.challenge.open();
		},
		openConfig() {
			this.$refs.config.open();
		},
		delay(index, time, _this) {
			return new Promise((resolve) => {
				setTimeout(() => {
					_this.$set(_this.list[index], 'class', 'ani' + index);
					resolve();
				}, time);
			});
		},
		start() {
			if (!this.run) {
				let _this = this;
				let integral = _this.config.card_base_integral ? _this.config.card_base_integral : 0;
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

				let card_mini_rewrad = this.config.card_mini_rewrad ? this.config.card_mini_rewrad : 0;
				card_mini_rewrad = parseInt(card_mini_rewrad);
				card_mini_rewrad = isNaN(card_mini_rewrad) ? 0 : card_mini_rewrad;

				let card_max_rewrad = this.config.card_max_rewrad ? this.config.card_max_rewrad : 0;
				card_max_rewrad = parseInt(card_max_rewrad);
				card_max_rewrad = isNaN(card_max_rewrad) ? 0 : card_max_rewrad;
				card_max_rewrad = card_max_rewrad < card_mini_rewrad ? card_mini_rewrad : card_max_rewrad;

				let card_base_rewrad = this.config.card_base_rewrad ? this.config.card_base_rewrad : 0;
				card_base_rewrad = parseInt(card_base_rewrad);
				card_base_rewrad = isNaN(card_base_rewrad) ? 0 : card_base_rewrad;

				let totalNum = 0;
				let rewardData = [];
				this.rewards.forEach((item) => {
					totalNum = totalNum + item.num;
					for (let i = 0; i < item.num; i++) {
						let newData = {
							key: item.key,
							reward: item.name
						};
						rewardData.push(newData);
					}
				});

				if (totalNum < card_mini_rewrad) {
					this.desc = '😭奖品数量不足！';
					_this.dialogVisible = true;
					return;
				}

				let min = Math.ceil(card_mini_rewrad);
				let max = Math.floor(card_max_rewrad);
				let allNum = Math.floor(Math.random() * (max - min + 1)) + min;
				//确保不得超过奖励
				if (totalNum < allNum) {
					allNum = totalNum;
				}

				let drawResult = [];
				//抽奖
				for (let i = 0; i < allNum; i++) {
					let number = Math.floor(Math.random() * rewardData.length);
					let reward = Object.assign({}, rewardData[number]);
					let data = {
						key: reward.key,
						reward: reward.reward,
						type: 'reward'
					};
					drawResult.push(data);
					rewardData.splice(number, 1);
				}

				//保底奖励
				if (this.base_rewards.length) {
					// 随机确定保底奖品出现的次数，至少1次，最多3次
					for (let i = 0; i < card_base_rewrad; i++) {
						let number = Math.floor(Math.random() * this.base_rewards.length);
						let data = {
							key: this.base_rewards[number].key,
							reward: this.base_rewards[number].name,
							type: 'base'
						};
						drawResult.push(data);
					}
				}

				//轮空
				const emptyCount = 10 - drawResult.length;
				for (let i = 0; i < emptyCount; i++) {
					let emptyData = {
						key: 0,
						reward: '未抽中奖品',
						type: 'no_reward'
					};
					drawResult.push(emptyData);
				}

				//奖励随机打乱
				drawResult = drawResult.sort(() => Math.random() - 0.5);
				const promises = this.list.map(
					(item, index) =>
						new Promise((resolve) => {
							setTimeout(() => {
								this.$set(this.list[index], 'class', 'ani' + index);
								resolve();
							}, index * 300);
						})
				);

				Promise.all(promises).then(() => {
					this.run = true;

					const rewardPromises = this.list.map(
						(item, index) =>
							new Promise((resolve) => {
								setTimeout(() => {
									let reward = drawResult[index];
									this.$set(this.list[index], 'class', item.class + ' showli');
									this.$set(this.list[index], 'reward', reward.reward);
									resolve();
								}, index * 300);
							})
					);

					Promise.all(rewardPromises).then(() => {
						//开始扣除奖励次数或者用户积分
						drawResult.forEach((item, index) => {
							if (item.type == 'reward') {
								let reward = _this.$db
									.get('rewards')
									.find({
										key: item.key
									})
									.value();
								_this.$db
									.get('rewards')
									.find({
										key: item.key
									})
									.assign({
										num: reward.num - 1
									})
									.write();
								let ballResult = this.user ? this.user.name + '抽中' + reward.name : reward.name;
								this.$db.get('result.CardReward').push(ballResult).write();
							}

							if (item.type == 'base') {
								let ballResult = this.user ? this.user.name + '抽中' + item.reward : item.reward;
								this.$db.get('result.CardReward').push(ballResult).write();
							}
						});

						//扣除当前用户积分，如果有用户的情况下
						if (_this.user && integral > 0 && _this.user.integral >= integral) {
							let newIntegral = parseInt(_this.user.integral) - parseInt(integral);
							this.$db
								.get('users')
								.find({
									key: _this.user.key
								})
								.assign({
									integral: newIntegral
								})
								.write();
							//更新当前用户信息
							let user = Object.assign({}, _this.user);
							user.integral = newIntegral;
							_this.$store.commit('ADD_USER', user);
						}
						_this.init();
					});
				});
			} else {
				this.list.forEach((item, index) => {
					item.class = '';
				});
				this.run = false;
			}
		},
		showCard(index) {}
	}
};
</script>

<style lang="scss" scoped>
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

.copy-right {
	position: absolute;
	bottom: 0;
	z-index: 99;
	font-size: 14px;
	right: 0;
	left: 0;
	font-weight: bold;
	text-align: right;
	color: #000;
	padding-right: 5px;
	height: 20px;
	line-height: 20px;
}

.main {
	height: 100%;
	width: 100%;
	position: relative;
	//background: #67c23a;
	background-image: linear-gradient(45deg, #67c23a 25%, transparent 25%, transparent 75%, #67c23a 75%, #67c23a),
		linear-gradient(45deg, #67c23a 25%, transparent 25%, transparent 75%, #67c23a 75%, #67c23a);
	background-size: 100px 100px;
	/* 条纹的大小 */
	background-position: 0 0, 50px 50px;

	/* 交错的条纹 */
	.back {
		position: absolute;
		top: 240px;
		right: 15px;
		height: 37px;
		cursor: pointer;
		z-index: 9999;
	}

	.voice {
		position: absolute;
		top: 180px;
		right: 15px;
		height: 40px;
		cursor: pointer;
		z-index: 9999;
	}

	.card-header {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 50px;
		line-height: 50px;
		display: flex;
		width: 100%;
		padding: 0 20px;

		.header-right {
			justify-content: center;
			align-items: center;
			flex: 1;
			display: flex;
			justify-content: flex-end;

			.header-btn {
				padding: 0;
				z-index: 99;
				color: #000;
				font-weight: bold;
				width: 80px;
				font-size: 16px;
			}
		}

		.header-left {
			width: 200px;
			display: flex;

			.user-btn {
				padding: 0;
				color: #f10000;
				font-weight: bold;
				cursor: pointer;
				z-index: 99;
				width: 200px;
				text-align: left;
				font-size: 16px;
			}
		}
	}
}

.content {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	padding: 140px 20px 20px 20px;
}

.grid {
	position: relative;
	height: 100%;
	width: 1125px;
	display: flex;

	.grid-left {
		.project {
			width: 180px;
			height: 253px;
			position: absolute;
			top: 273px;
			left: 950px;

			.front {
				width: 100%;
				height: 100%;
				background: url('../assets/card/project_front_bg.png') round;
				position: absolute;
				left: 0;
				top: 0;
				width: 180px;
				height: 253px;
				padding: 0 16px;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.back {
				position: absolute;
				left: 0;
				top: 0;
				width: 180px;
				height: 253px;
				padding: 0 16px;
				text-align: center;
				background: url('../assets/card/project_back_bg.png') round;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
				font-size: 26px;
			}
		}
	}

	.grid-right {
		width: 180px;
		position: absolute;
		left: 950px;
		top: 0 !important;

		.aniwz {
			height: 253px;
			width: 180px;
			text-align: center;
			font-size: 32px;

			.text {
				padding-top: 110px;
			}
		}

		.controls {
			height: 253px;
			width: 180px;
			position: relative;
			cursor: pointer;

			.mask {
				position: absolute;
				background: url('../assets/card/project_card_bg.png') round;
				width: 180px;
				height: 100%;
				overflow: hidden;
				text-align: center;
				font-size: 32px;
				top: 0;
			}

			.text {
				padding-top: 110px;
			}

			.bottom {
				background: url('../assets/card/project_card_bot_bg.png') round;
				position: absolute;
				bottom: -6px;
				right: 0;
				width: 180px;
				height: 66px;
				-webkit-transition: all 0.3s ease;
				-moz-transition: all 0.3s ease;
				-o-transition: all 0.3s ease;
				-ms-transition: all 0.3s ease;
				transition: all 0.3s ease;
			}
		}
	}
}

.controls .bottom + .bottom + .bottom {
	bottom: -2px;
}

.controls .bottom + .bottom {
	bottom: -4px;
}

.controls:hover .bottom + .bottom + .bottom {
	bottom: -6px;
}

.controls:hover .bottom + .bottom {
	bottom: -10px;
}

.controls:hover .bottom {
	bottom: -12px;
}

.project.ani0 {
	left: 0px !important;
	top: 0 !important;
}

.project.ani1 {
	left: 190px !important;
	top: 0 !important;
}

.project.ani2 {
	left: 380px !important;
	top: 0 !important;
}

.project.ani3 {
	left: 570px !important;
	top: 0 !important;
}

.project.ani4 {
	left: 760px !important;
	top: 0 !important;
}

.project.ani5 {
	left: 0px !important;
	top: 263px !important;
}

.project.ani6 {
	left: 190px !important;
	top: 263px !important;
}

.project.ani7 {
	left: 380px !important;
	top: 263px !important;
}

.project.ani8 {
	left: 570px !important;
	top: 263px !important;
}

.project.ani9 {
	left: 760px !important;
	top: 263px !important;
}

.project span {
	display: inline-block;
	border-radius: 50%;
	width: 120px;
	height: 120px;
}

.project.ani0 span {
	background: #ef4036;
}

.project.ani1 span {
	background: #ff6c00;
}

.project.ani2 span {
	background: #ffde00;
}

.project.ani3 span {
	background: #0ce501;
}

.project.ani4 span {
	background: #05e7df;
}

.project.ani5 span {
	background: #007df1;
}

.project.ani6 span {
	background: #8e00f1;
}

.project.ani7 span {
	background: #000000;
}

.project.ani8 span {
	background: #f56c6c;
}

.project.ani9 span {
	background: #67c23a;
}

.project {
	-webkit-perspective: 1000;
	-moz-perspective: 1000;
	-o-perspective: 1000;
	perspective: 1000;
	-ms-transform: perspective(1000px);
	-moz-transform: perspective(1000px);
	-ms-transform-style: preserve-3d;
	-moz-transform-style: preserve-3d;
}

.project .back,
.project .front {
	-webkit-backface-visibility: hidden;
	-moz-backface-visibility: hidden;
	-o-backface-visibility: hidden;
	-ms-backface-visibility: hidden;
	backface-visibility: hidden;
	-webkit-transform-style: preserve-3d;
	-moz-transform-style: preserve-3d;
	-o-transform-style: preserve-3d;
	-ms-transform-style: preserve-3d;
	transform-style: preserve-3d;
}

.project .front {
	-webkit-transform: rotateY(0deg);
	-ms-transform: rotateY(0deg);
}

.project .back {
	-webkit-transform: rotateY(180deg);
	-moz-transform: rotateY(180deg);
	-o-transform: rotateY(180deg);
	-ms-transform: rotateY(180deg);
	transform: rotateY(180deg);
}

.project,
.project .back,
.project .front {
	-webkit-transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	-moz-transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	-o-transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	-ms-transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.project.showli .front {
	-webkit-transform: rotateY(180deg);
	-moz-transform: rotateY(180deg);
	-o-transform: rotateY(180deg);
	transform: rotateY(180deg);
}

.project.showli .back {
	-webkit-transform: rotateY(0deg);
	-moz-transform: rotateY(0deg);
	-o-transform: rotateY(0deg);
	-ms-transform: rotateY(0deg);
	transform: rotateY(0deg);
}
</style>
