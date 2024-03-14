<template>
	<el-dialog :visible.sync="visible" :append-to-body="true" width="600px" class="c-LotteryConfig" :close-on-click-modal="false">
		<div class="c-LotteryConfigtitle" slot="title">
			<span :style="{ fontSize: '16px', marginRight: '20px' }">抽奖结果</span>
			<el-button size="mini" type="primary" @click="onSubmit">清空数据</el-button>
		</div>
		<div class="container">
			<el-collapse v-for="(item, key, index) in result" :key="index" class="listrow">
				<el-collapse-item style="width: 100%" class="is-active">
					<template slot="title">
						<span class="name">{{ data[key] }}</span>
					</template>
					<span class="value">
						<span v-if="item && item.length === 0">暂未抽奖</span>
						<span class="card" v-for="(data, j) in item" :key="j" :data-res="data">{{ data }}</span>
					</span>
				</el-collapse-item>
			</el-collapse>
		</div>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			visible: false,
			result: [],
			data: {
				Gashapon: '扭一下蛋',
				RewardBox: '开个箱吧',
				RollCallReward: '点名抽奖',
				RollCall: '随机点名',
				RollReward: '随机抽奖',
				RollBall: '炫酷抽奖'
			}
		};
	},
	methods: {
		open() {
			this.visible = true;
			this.result = this.$db.get('result').value();
		},
		close() {
			this.visible = false;
		},
		onSubmit() {
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

			this.$message({
				message: '清空数据成功',
				type: 'success'
			});

			this.$nextTick(() => {
				this.$emit('on-reset');
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.c-LotteryConfig {
	.el-dialog__body {
		height: 340px;
		.container {
			height: 100%;
			overflow-y: auto;
			padding: 0 10px;
		}
	}
}
.dialog-showAddLottery {
	.el-dialog {
		height: 186px;
	}
}

.listrow {
	display: flex;
	line-height: 30px;
	.name {
		text-align: center;
		width: 100%;
		color: #ffeb00;
		color: #ecb518;
		font-weight: bold;
		font-size: 20px;
	}
	.value {
		flex: 1;
	}
	.card {
		display: inline-block;
		padding: 0 5px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 14px;
		font-weight: bold;
		border-radius: 4px;
		border: 1px solid #ccc;
		color: #fff;
		background-color: #409eff;
		border-color: #409eff;
		margin-left: 5px;
		margin-bottom: 5px;
		position: relative;
		cursor: pointer;
	}
}
</style>
