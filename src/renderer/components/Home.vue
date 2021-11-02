<template>
	<div class="home">
		<div class="draw">
			<div class="header">
				<el-button class="header-btn btn-4" type="text" @click="openNames()">抽奖名单</el-button>
				<el-button class="header-btn btn-3" type="text" @click="openRewards()">奖项配置</el-button>
				<el-button class="header-btn btn-2" type="text" @click="openResult()">抽奖结果</el-button>
				<el-button class="header-btn btn-1" type="text" @click="openConfig()">系统配置</el-button>
			</div>

			<div class="main-content" v-show="mode == 0">
				<el-button class="mode-btn blue" type="primary" @click="changeMode(1)">随机抽奖</el-button>
				<el-button class="mode-btn pink" type="primary" @click="changeMode(2)">随机点名</el-button>
				<el-button class="mode-btn green" type="primary" @click="changeMode(3)">点名抽奖</el-button>
				<el-button class="mode-btn yellow" type="primary" @click="changeMode(4)">扭一下蛋</el-button>
				<el-button class="mode-btn red" type="primary" @click="changeMode(5)">开个箱吧</el-button>
			</div>
			<div class="main-content" v-show="mode != 0">
				<RollReward ref="rollreward" v-if="mode == 1" @on-close="backHome" @on-run="runTask"></RollReward>
				<RollCall ref="rollcall" v-if="mode == 2" @on-close="backHome" @on-run="runTask"></RollCall>
				<RollCallReward ref="rollcallreward" v-if="mode == 3" @on-close="backHome" @on-run="runTask"></RollCallReward>
				<Gashapon ref="gashapon" v-if="mode == 4" @on-close="backHome" @on-run="runTask"></Gashapon>
				<RewardBox ref="rewardbox" v-if="mode == 5" @on-close="backHome" @on-run="runTask"></RewardBox>
			</div>
			<img src="../assets/voice_close.png" class="voice" @click="voiceChage(true)" v-if="!voice" />
			<img src="../assets/voice_open.png" class="voice" @click="voiceChage(false)" v-if="voice" />
		</div>
		<audio id="audiobg" preload="auto" controls autoplay loop @play="playHandler" @pause="pauseHandler">
			<source :src="audioSrc" />
			你的浏览器不支持audio标签
		</audio>
		<!--<span class="copy-right">版权所有：Sordors@2021</span>-->
		<Config ref="config" @on-reset="reset"></Config>
		<Names ref="names"></Names>
		<Rewards ref="rewards"></Rewards>
		<Result ref="result" @on-reset="reset"></Result>
	</div>
</template>

<script>
import Names from './Names';
import Config from './Config';
import Rewards from './Rewards';
import Result from './Result';
import RollCall from './RollCall';
import RollReward from './RollReward';
import RollCallReward from './RollCallReward';
import Gashapon from './Gashapon';
import RewardBox from './RewardBox';
import bgaudio from '@/assets/before.mp3';
import beginaudio from '@/assets/start.mp3';

export default {
	components: { Config, Names, Rewards, RollCall, RollReward, RollCallReward, Gashapon, RewardBox, Result },
	data() {
		return {
			mode: 0,
			voice: false,
			audioSrc: bgaudio
		};
	},
	mounted() {
		let config = this.$db.get('config').value();
		if (config.refresh == 1) {
			this.$db
				.set('result', {
					RewardBox: [],
					RollCall: [],
					RollCallReward: [],
					RollReward: [],
					Gashapon: []
				})
				.write();
		}

		this.voiceChage(false);
	},
	methods: {
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
		loadAudio() {
			if (this.voice) {
				this.$el.querySelector('#audiobg').load();
				this.$nextTick(() => {
					this.$el.querySelector('#audiobg').play();
				});
			} else {
				this.$el.querySelector('#audiobg').load();
				this.$nextTick(() => {
					this.$el.querySelector('#audiobg').pause();
				});
			}
		},
		openConfig() {
			this.$refs.config.open();
		},
		openNames() {
			this.$refs.names.open();
		},
		openRewards() {
			this.$refs.rewards.open();
		},
		openResult() {
			this.$refs.result.open();
		},
		changeMode(mode) {
			this.mode = mode;
			this.$nextTick(() => {
				if (mode == 1) {
					this.$refs.rollreward.init();
				}
				if (mode == 2) {
					this.$refs.rollcall.init();
				}
				if (mode == 3) {
					this.$refs.rollcallreward.init();
				}
				if (mode == 4) {
					this.$refs.gashapon.init();
				}
				if (mode == 5) {
					this.$refs.rewardbox.init();
				}
			});
		},
		runTask(state) {
			if (state) {
				this.audioSrc = beginaudio;
				this.loadAudio();
			} else {
				this.audioSrc = bgaudio;
				this.loadAudio();
			}
		},
		backHome() {
			this.mode = 0;
			this.audioSrc = bgaudio;
			this.loadAudio();
		},
		reset() {
			this.$nextTick(() => {
				if (this.mode == 1) {
					this.$refs.rollreward.init();
				}

				if (this.mode == 2) {
					this.$refs.rollcall.init();
				}

				if (this.mode == 3) {
					this.$refs.rollcallreward.init();
				}

				if (this.mode == 4) {
					this.$refs.gashapon.init();
				}

				if (this.mode == 5) {
					this.$refs.rewardbox.init();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.home {
	height: 100%;
	width: 100%;
}
.voice {
	position: absolute;
	top: 80px;
	right: 10px;
	height: 40px;
	cursor: pointer;
}
.header {
	height: 50px;
	line-height: 50px;
	position: relative;
	.header-btn {
		position: absolute;
		top: 17px;
		padding: 0;
		z-index: 99;

		&.btn-1 {
			right: 20px;
		}
		&.btn-2 {
			right: 100px;
		}
		&.btn-3 {
			right: 180px;
		}
		&.btn-4 {
			right: 260px;
		}
	}
}

.draw {
	height: 100%;
	position: relative;
	background-image: url('../assets/bg.jpg');
	background-size: 100% 100%;
	background-position: center center;
	background-repeat: no-repeat;
	background-color: #121936;
	.mask {
		-webkit-filter: blur(5px);
		filter: blur(5px);
	}
	.main-content {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.mode-btn {
			margin-top: 20px;
			margin-left: 0px;
			width: 300px;
			height: 70px;
		}
		.red {
			background: #f44336;
			border-color: #f44336;
		}

		.pink {
			background: #ff4f7d;
			border-color: #ff4f7d;
		}
		.blue {
			background: #2db7f5;
			border-color: #2db7f5;
		}
		.green {
			background: #19be6b;
			border-color: #19be6b;
		}

		.yellow {
			background: #fdd865;
			border-color: #fdd865;
		}
	}
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
</style>
