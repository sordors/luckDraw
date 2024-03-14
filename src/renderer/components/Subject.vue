<template>
	<div class="main">
		<div class="subject-header">
			<div class="header-left">
				<el-button class="user-btn" type="text" @click="chooseUser()">
					{{ user ? '姓名：' + user.name + ',积分：' + user.integral + '，点击重选' : '选择用户' }}
				</el-button>
			</div>
			<div class="header-right">
				<div class="rank">{{ first ? '当前NO.1 ' + first : '' }}</div>
				<el-button class="header-btn btn-4" type="text" @click="openTop()">TOP排行榜</el-button>
				<el-button class="header-btn btn-3" type="text" @click="openNames()">名单配置</el-button>
				<el-button class="header-btn btn-2" type="text" @click="openSubject()">题库配置</el-button>
				<el-button class="header-btn btn-1" type="text" @click="openConfig()">系统配置</el-button>
			</div>
		</div>
		<img src="../assets/voice_close.png" class="voice" @click="voiceChage(true)" v-if="!voice" />
		<img src="../assets/voice_open.png" class="voice" @click="voiceChage(false)" v-if="voice" />
		<img src="../assets/back.png" class="back" @click="close" />
		<div class="subject-draw">
			<div class="box" v-show="!show">
				<p class="title">趣味竞赛</p>
				<button class="start" @click="start">点击开始</button>
			</div>
			<div class="game-box" v-show="show">
				<div class="challenge">当前挑战者：{{ user.name }}</div>
				<div class="tip">
					<div class="fl">
						<p>计时：{{ count }}秒</p>
						<p>成绩：{{ integral }}分</p>
					</div>
					<div class="fr">
						<p>答对：{{ success }}题</p>
						<p>答错：{{ error }}题</p>
					</div>
				</div>
				<div class="subject">
					<span style="color: #ffffff">{{ number }}.</span>
					{{ subject.title }}
				</div>
				<div class="choose-list">
					<div
						class="choose-item"
						v-for="(item, index) in subject.answers"
						:key="index"
						@click="answer(item.key)"
						:class="choose ? (item.key == subject.result ? 'success' : item.key == choose ? 'error' : '') : ''"
					>
						{{ item.key }}: {{ item.desc }}
					</div>
				</div>
			</div>
		</div>
		<Names ref="names"></Names>
		<Config ref="config" @on-reset="reset"></Config>
		<SubjectDb ref="subjectDb" @on-reset="resetSubject"></SubjectDb>
		<Challenge ref="challenge" @on-success="showTime"></Challenge>
		<Rank ref="rank"></Rank>
		<audio id="audiobg" preload="auto" controls autoplay loop @play="playHandler" @pause="pauseHandler" style="display: none">
			<source :src="audioSrc" />
			你的浏览器不支持audio标签
		</audio>
		<span class="copy-right">软件作者：Sordors</span>
	</div>
</template>

<script>
import Names from './Names';
import Config from './Config';
import SubjectDb from './SubjectDb';
import Challenge from './Challenge';
import Rank from './Rank';
import bgaudio from '@/assets/before.mp3';
export default {
	components: { Names, Config, SubjectDb, Challenge, Rank },
	computed: {
		user() {
			return this.$store.state.user.data;
		}
	},
	data() {
		return {
			show: false,
			config: {
				refresh: 1,
				rollcall: 1,
				rollreward: 1,
				time: 30
			},
			origin: [],
			data: [],
			integral: 0,
			success: 0,
			error: 0,
			count: 0,
			timer: null,
			subject: {},
			number: 0,
			choose: '',
			result: '',
			first: '',
			voice: false,
			audioSrc: bgaudio
		};
	},
	created() {
		this.config = this.$db.get('config').value();
		this.origin = this.$subjectDb.get('data').value();
		this.data = [].concat(this.origin);
		this.count = this.config.time || 30;
		let ranks = this.$db.get('rank').sortBy('ranking').value();
		if (ranks && ranks.length > 0) {
			this.first = ranks[0].name || '';
		}
	},
	mounted() {
		this.voiceChage(false);
	},
	destroyed() {
		if (this.timer != null) {
			clearInterval(this.timer);
			this.timer = null;
		}
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
		countDown() {
			let _this = this;
			this.timer = setInterval(() => {
				if (_this.count === 1) {
					let integral = _this.integral;
					let rank = _this.getRank();
					let user = _this.user;
					_this.init();
					this.$alert('答题结束, 挑战者' + user + '获得积分' + integral + ',排名第' + rank + '位?', '温馨提示');
				} else {
					_this.count = _this.count - 1;
				}
			}, 1000);
		},
		init() {
			if (this.timer != null) {
				clearInterval(this.timer);
				this.timer = null;
			}
			this.count = this.config.time || 30;
			this.show = false;
			this.number = 0;
			this.choose = '';
			this.result = '';
			this.integral = 0;
			this.success = 0;
			this.error = 0;
			this.subject = {};
			this.data = [].concat(this.origin);
			console.log(this.data);
		},
		openTop() {
			this.$refs.rank.open();
		},
		openNames() {
			this.$refs.names.open();
		},
		openConfig() {
			this.$refs.config.open();
		},
		openSubject() {
			this.$refs.subjectDb.open();
		},
		start() {
			if (!this.data.length) {
				this.$message.error('请先录入题库');
			}

			if (!this.user) {
				this.$refs.challenge.open();
				this.$message.error('请先选择用户');
			} else {
				this.show = true;
				this.countDown();
				this.getSubject();
			}
		},
		showTime(user) {
			if (!this.user) {
				this.$message.error('请先选择用户');
			} else {
				this.show = true;
				this.countDown();
				this.getSubject();
			}
		},
		getSubject() {
			if (this.data.length) {
				let index = Math.floor(Math.random() * this.data.length);
				this.subject = this.data[index];
				this.data.splice(index, 1);
				this.number++;
			}
		},
		close() {
			this.$router.go(-1);
		},
		reset() {
			this.config = this.$db.get('config').value();
		},
		resetSubject() {
			this.data = this.$subjectDb.get('data').value();
		},
		getRank() {
			let ranks = this.$db.get('rank').sortBy('ranking').value();
			if (!ranks || ranks.length <= 0) {
				let data = [
					{
						name: this.user.name,
						store: this.integral,
						ranking: 1
					}
				];
				this.first = this.user.name;
				this.$db.set('rank', data).write();
				return 1;
			} else {
				let prescore = this.integral;
				let ranking = 1;
				ranks.forEach((item) => {
					if (item.store >= prescore) {
						ranking++;
					}
				});

				if (ranking > 10) {
					ranking = 10;
				}

				ranks.push({
					name: this.user.name,
					store: this.integral,
					ranking: ranking
				});

				let newRanks = ranks.sort(function (a, b) {
					return b.store - a.store;
				});

				let newSet = newRanks.slice(0, 10);
				newSet.forEach((item, index) => {
					item.ranking = index + 1;
				});

				this.first = newSet[0].name || '';
				this.$db.set('rank', newSet).write();
				return ranking;
			}
		},
		answer(result) {
			this.choose = result;
			if (this.choose == this.subject.result) {
				this.success = this.success + 1;
				this.integral = 10 * this.success;
			} else {
				this.error = this.error + 1;
			}

			let _this = this;
			setTimeout(() => {
				_this.choose = '';
				if (_this.data.length) {
					_this.getSubject();
				} else {
					let integral = _this.integral;
					let rank = _this.getRank();
					let user = _this.user.name;
					_this.init();

					this.$alert('答题结束, 挑战者' + user + '获得积分' + integral + ',排名第' + rank + '位?', '温馨提示');
				}
			}, 500);
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	height: 100%;
	width: 100%;
	display: flex;
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
	.voice {
		position: absolute;
		top: 180px;
		right: 15px;
		height: 40px;
		cursor: pointer;
	}
}
.subject-header {
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
		.rank {
			color: #ff0000;
			font-size: 16px;
			font-weight: bold;
			text-align: center;
			font-size: 16px;
			margin-right: 10px;
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
.subject-draw {
	position: absolute;
	top: 80px;
	right: 50px;
	left: 50px;
	bottom: 50px;
	background-image: url('../assets/black.png');
	background-size: 100% 100%;
	background-position: center center;
	background-repeat: no-repeat;
	padding: 60px;
}
@media (min-width: 1200px) {
	.subject-draw {
		padding: 80px 120px;
	}
}

@media (min-width: 1051px) and (max-width: 1199px) {
	.subject-draw {
		padding: 80px 100px;
	}
}

@media (min-width: 980px) and (max-width: 1050px) {
	.subject-draw {
		padding: 80px 110px;
	}
}

@media (min-width: 850px) and (max-width: 979px) {
	.subject-draw {
		padding: 80px;
	}
}

@media (min-width: 768px) and (max-width: 849px) {
	.subject-draw {
		padding: 100px;
	}
}

.box {
	height: 100%;
	color: #ffffff;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.title {
		margin-top: 110px;
		font-size: 50px;
		text-align: center;
		flex: 1;
	}
	.start {
		flex: 1;
		outline: medium;
		border: 0;
		text-align: center;
		font-size: 36px;
		background: none;
		color: #fff;
		cursor: pointer;
	}
}
.game-box {
	height: 100%;
	color: #ffffff;
	.challenge {
		font-size: 24px;
		text-align: center;
		color: #e6a23c;
	}
	.tip {
		width: 100%;
		height: 80px;
		.fl {
			float: left;
			font-size: 20px;
			p {
				margin-bottom: 5px;
			}
		}
		.fr {
			float: right;
			font-size: 20px;
			p {
				margin-bottom: 5px;
			}
		}
	}
	.subject {
		font-size: 26px;
		color: #e6a23c;
	}
	.choose-list {
		margin-top: 15px;
		font-size: 26px;
		.choose-item {
			margin-top: 15px;
			cursor: pointer;
			border-radius: 5px;
			background-color: #f6f7f9;
			padding: 10px;
			overflow: hidden;
			color: #000;
			font-size: 20px;
		}
		.error {
			background-color: #fe7875;
			color: #fff;
		}
		.success {
			background-color: #93df63;
			color: #fff;
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
