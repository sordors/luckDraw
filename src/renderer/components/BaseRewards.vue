<template>
	<div>
		<el-dialog :append-to-body="true" :visible.sync="showImport" class="import-dialog" width="600px" :close-on-click-modal="false">
			<el-input
				type="textarea"
				:rows="10"
				placeholder="请输入对应的保底奖(可直接从excel复制)，一行一个,格式:奖品如：
保底奖1
保底奖2
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
			let rewards = this.$db.get('base_rewards').value();
			this.listStr = '';
			rewards.forEach((item) => {
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
			this.$db.set('base_rewards', list).write();
			this.$message({
				message: '保存成功',
				type: 'success'
			});
			this.showImport = false;
			this.$emit('on-success',{});
		}
	}
};
</script>

<style lang="scss" scoped>
.import-dialog {
	.footer {
		height: 50px;
		line-height: 50px;
		text-align: center;
	}
}
</style>
