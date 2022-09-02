<template>
	<el-dialog :visible.sync="visible" :append-to-body="true" width="600px" class="c-LotteryConfig" :close-on-click-modal="false">
		<div class="c-LotteryConfigtitle" slot="title">
			<span :style="{ fontSize: '16px', marginRight: '20px' }">系统配置</span>
			<el-button size="mini" type="primary" @click="onSubmit">保存配置</el-button>
			<el-button size="mini" @click="close()">取消</el-button>
		</div>
		<div class="container">
			<el-form ref="form" :model="config" size="mini">
				<el-form-item label="启动软件是否清空抽奖结果">
					<el-radio v-model="config.refresh" :label="1">清空</el-radio>
					<el-radio v-model="config.refresh" :label="2">不清空</el-radio>
				</el-form-item>
				<el-form-item label="是否允许重复点名">
					<el-radio v-model="config.rollcall" :label="1">是</el-radio>
					<el-radio v-model="config.rollcall" :label="2">否</el-radio>
				</el-form-item>
				<el-form-item label="是否允许重复抽奖">
					<el-radio v-model="config.rollreward" :label="1">是</el-radio>
					<el-radio v-model="config.rollreward" :label="2">否</el-radio>
				</el-form-item>
				<el-form-item label="答题时间(秒)"><el-input type="number" v-model="config.time" :min="1" :step="1"></el-input></el-form-item>
			</el-form>
		</div>
	</el-dialog>
</template>
<script>
export default {
	data() {
		return {
			visible: false,
			config: {
				refresh: 1,
				rollcall: 1,
				rollreward: 1,
				time: 30
			}
		};
	},
	methods: {
		open() {
			this.visible = true;
			this.config = this.$db.get('config').value();
		},
		close() {
			this.visible = false;
		},
		onSubmit() {
			this.$db.set('config', this.config).write();

			this.$message({
				message: '保存成功',
				type: 'success'
			});

			this.$nextTick(() => {
				this.$emit('on-reset');
			});
		}
	}
};
</script>
<style lang="scss">
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
</style>
