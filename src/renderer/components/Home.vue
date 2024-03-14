<template>
	<div class="home">
		<div class="draw" :class="mode == 6 ? 'newBackGroup' : ''">
			<div class="header">
				<div class="header-left">
					<el-button class="user-btn" type="text" @click="chooseUser()">
						{{ user ? '姓名：' + user.name + ',积分：' + user.integral + '，点击重选' : '选择用户' }}
					</el-button>
				</div>
				<div class="header-right">
					<el-button class="header-btn btn-5" type="text" @click="openUsers()">用户配置</el-button>
					<el-button class="header-btn btn-4" type="text" @click="openRewards()">奖项配置</el-button>
					<el-button class="header-btn btn-3" type="text" @click="openResult()">抽奖结果</el-button>
					<el-button class="header-btn btn-2" type="text" @click="openConfig()">系统配置</el-button>
					<el-button class="header-btn btn-1" type="text" @click="introduce = true">关于软件</el-button>
				</div>
			</div>

			<div class="main-content" v-show="mode == 0">
				<div style="width: 608px">
					<el-button class="mode-btn blue" type="primary" @click="changeMode(1)">随机抽奖</el-button>
					<el-button class="mode-btn pink" type="primary" @click="changeMode(2)">随机点名</el-button>
				</div>
				<div style="width: 608px">
					<el-button class="mode-btn green" type="primary" @click="changeMode(3)">点名抽奖</el-button>
					<el-button class="mode-btn yellow" type="primary" @click="changeMode(4)">扭一下蛋</el-button>
				</div>
				<div style="width: 608px">
					<el-button class="mode-btn red" type="primary" @click="changeMode(5)">开个箱吧</el-button>
					<el-button class="mode-btn blue-2" type="primary" @click="changeMode(6)">炫酷抽奖</el-button>
				</div>
				<div style="width: 608px"><el-button class="mode-btn orange" type="primary" @click="gotoSubject()">趣味竞赛</el-button></div>
			</div>
			<div class="main-content" v-show="mode != 0">
				<RollReward ref="rollreward" v-if="mode == 1" @on-close="backHome" @on-run="runTask"></RollReward>
				<RollCall ref="rollcall" v-if="mode == 2" @on-close="backHome" @on-run="runTask"></RollCall>
				<RollCallReward ref="rollcallreward" v-if="mode == 3" @on-close="backHome" @on-run="runTask"></RollCallReward>
				<Gashapon ref="gashapon" v-if="mode == 4" @on-close="backHome" @on-run="runTask"></Gashapon>
				<RewardBox ref="rewardbox" v-if="mode == 5" @on-close="backHome" @on-run="runTask"></RewardBox>
				<RollBall ref="rewardball" v-if="mode == 6" @on-close="backHome" @on-run="runTask"></RollBall>
			</div>
			<img src="../assets/voice_close.png" class="voice" @click="voiceChage(true)" v-if="!voice" />
			<img src="../assets/voice_open.png" class="voice" @click="voiceChage(false)" v-if="voice" />
		</div>
		<audio id="audiobg" preload="auto" controls autoplay loop @play="playHandler" @pause="pauseHandler" style="display: none">
			<source :src="audioSrc" />
			你的浏览器不支持audio标签
		</audio>
		<span class="copy-right">软件作者：Sordors</span>
		<Config ref="config" @on-reset="reset"></Config>
		<UserList ref="users"></UserList>
		<RewardList ref="rewards"></RewardList>
		<Result ref="result" @on-reset="reset"></Result>
		<Challenge ref="challenge" @on-success="onChooseUser"></Challenge>

		<el-dialog :visible.sync="introduce" width="600px" title="关于软件" center>
			<div class="introduce">
				<p>以下纯属自言自语，看到最好看不到你可能是瞎了：</p>
				<p>1. 本软件由作者Sordors制作，一般人找不到他。</p>
				<p>2. 奉劝各位耗子尾汁，考个好的成绩，时代发展太快，不读书是不行的！</p>
				<p>3. 若无天灾人祸，你们应该活得比我们久，会的会比我们多，学的会比我们快，一粒尘可填海，一根草亦可斩尽日月星辰，即使渺小，也可优秀！</p>
				<p>4. 每个人都有属于自己的一片森林，也许我们从来不曾去过，但它一直在那里，总会在那里。迷失的人迷失了，相逢的人会再相逢。——村上春树</p>
				<p>5. 最后古语曰：老师也是人，请爱她们，关心她们，记住她们。(我还没找到出处就是了)</p>
				<p style="text-align: right">此致，敬礼并圆润的转圈圈离开</p>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import UserList from './UserList';
import Config from './Config';
import RewardList from './RewardList';
import Result from './Result';
import RollCall from './RollCall';
import RollReward from './RollReward';
import RollCallReward from './RollCallReward';
import Gashapon from './Gashapon';
import Challenge from './Challenge';
import RewardBox from './RewardBox';
import RollBall from './RollBall';
import bgaudio from '@/assets/before.mp3';
import beginaudio from '@/assets/start.mp3';

export default {
	components: { Config, Challenge, UserList, RewardList, RollCall, RollReward, RollCallReward, Gashapon, RewardBox, Result, RollBall },
	data() {
		return {
			mode: 0,
			voice: false,
			audioSrc: bgaudio,
			introduce: false
		};
	},
	computed: {
		user() {
			return this.$store.state.user.data;
		}
	},
	mounted() {
		console.log(this.$store.state.user);
		let config = this.$db.get('config').value();
		if (config.refresh == 1) {
			this.$db
				.set('result', {
					RewardBox: [],
					RollCall: [],
					RollCallReward: [],
					RollReward: [],
					Gashapon: [],
					RollBall: []
				})
				.write();
		}

		this.voiceChage(false);
	},
	methods: {
		chooseUser() {
			this.$refs.challenge.open();
		},
		onChooseUser() {
			console.log(this.$store);
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
		openUsers() {
			this.$refs.users.open();
		},
		openRewards() {
			this.$refs.rewards.open();
		},
		openResult() {
			this.$refs.result.open();
		},
		openSubject() {
			this.$refs.subjectDb.open();
		},
		gotoSubject() {
			this.$router.push({ path: 'subject' });
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
				if (mode == 6) {
					this.$refs.rewardball.init();
				}
			});
		},
		runTask(state) {
			if (state) {
				if (this.audioSrc != beginaudio) {
					this.audioSrc = beginaudio;
					this.loadAudio();
				}
			} else {
				if (this.audioSrc != bgaudio) {
					this.audioSrc = bgaudio;
					this.loadAudio();
				}
			}
		},
		backHome() {
			this.mode = 0;
			if (this.audioSrc != bgaudio) {
				this.audioSrc = bgaudio;
				this.loadAudio();
			}
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

				if (this.mode == 6) {
					this.$refs.rewardball.init();
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
	width: 100%;
}
.voice {
	position: absolute;
	top: 180px;
	right: 15px;
	height: 40px;
	cursor: pointer;
}
.header {
	height: 50px;
	line-height: 50px;
	position: relative;
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
			height: 100px;
			border-radius: 20px;
			font-size: 22px;
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

		.orange {
			background: #fe9500;
			border-color: #fe9500;
			width: 100%;
		}

		.blue-2 {
			background: #2196f3;
			border-color: #2196f3;
		}
	}
}

.newBackGroup {
	background-image: url('../assets/bg2.jpeg') !important;
	.header-btn {
		color: #ffffff !important;
	}

	.user-btn {
		color: #00f735 !important;
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

.introduce {
	height: 350px;
	font-size: 16px;
	line-height: 30px;
	color: #000;
	font-weight: bold;
}
</style>
