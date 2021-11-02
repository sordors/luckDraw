<template>
	<div>
		<el-dialog :append-to-body="true" :visible.sync="showImport" class="import-dialog" width="600px" :close-on-click-modal="false">
			<el-input
				type="textarea"
				:rows="10"
				placeholder="请输入对应的奖项(可直接从excel复制)，一行一个。如：
一等奖
二等奖
三等奖
								"
				v-model="listStr"
			></el-input>
			<div class="footer">
				<el-button size="mini" type="primary" @click="sumbit">确定</el-button>
				<el-button size="mini" @click="showImport = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			showImport: false,
			listStr: ''
		};
	},
	methods: {
		open() {
			this.showImport = true;
			let rewards = this.$db.get('rewards').value();
			this.listStr = '';
			rewards.forEach(item => {
				if (this.listStr.length) {
					this.listStr = this.listStr + '\n' + item.name;
				} else {
					this.listStr = item.name;
				}
			});
		},
		close() {
			this.showImport = false;
		},
		sumbit() {
			const { listStr } = this;
			if (!listStr) {
				this.$message.error('没有数据');
			}
			const list = [];
			const rows = listStr.split('\n');
			if (rows && rows.length > 0) {
				rows.forEach((item, index) => {
					if (item.length) {
						list.push({
							key: index + 1,
							name: item
						});
					}
				});
			}
			this.$db.set('rewards', list).write();
			this.$db.set('result.RewardBox', []).write();
			this.$db.set('result.RollReward', []).write();
			this.$db.set('result.Gashapon', []).write();
			this.$message({
				message: '保存成功',
				type: 'success'
			});
			this.showImport = false;
			this.$nextTick(() => {
				this.$emit('resetConfig');
			});
		}
	}
};
</script>

<style lang="scss">
.import-dialog {
	.footer {
		height: 50px;
		line-height: 50px;
		text-align: center;
	}
}
</style>
