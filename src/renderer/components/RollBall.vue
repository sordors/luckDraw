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

		<el-dialog :visible.sync="dialogVisible" width="260px"><div class="digcontent" v-html="desc"></div></el-dialog>
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
			desc: '咦？没有抽中？'
		};
	},
	methods: {
		init() {
			this.initData();

			this.$nextTick(() => {
				this.startTagCanvas();
			});
		},
		initData() {
			let config = this.$db.get('config').value();
			this.data = this.$db.get('rewards').value();
			let result = this.$db.get('result.RollBall').value();
			this.rewards = [];
			this.data.forEach(item => {
				if (config.rollreward == 2 && result.length > 0) {
					if (result.indexOf(item.name) != -1) {
						this.rewards.push(item.name);
					}
				} else {
					this.rewards.push(item.name);
				}
			});
		},
		speed() {
			return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
		},
		createCanvas() {
			const canvas = document.createElement('canvas');
			canvas.width = 500;
			canvas.height = 500;
			canvas.id = 'rootcanvas';
			this.$el.querySelector('#box').appendChild(canvas);
		},
		startTagCanvas() {
			this.createCanvas();
			const { speed } = this;
			window.TagCanvas.Start('rootcanvas', 'tags', {
				textColour: '#2997F7',
				initial: speed(),
				dragControl: 1,
				decel: 0.5,
				textHeight: 26,
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
					if (!_this.rewards.length) {
						_this.desc = '咦？没有抽中？';
					} else {
						_this.desc = '恭喜你获得<br>' + _this.rewards[number];
						_this.$db
							.get('result.RollBall')
							.push(_this.rewards[number])
							.write();
						_this.initData();
					}
					_this.dialogVisible = true;
					this.$emit('on-run', this.running);
				}
			} else {
				_this.desc = '咦？没有抽中？';
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
