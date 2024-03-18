<template>
	<div>
		<el-dialog :append-to-body="true" :visible.sync="showImport" class="import-dialog" width="600px" :close-on-click-modal="false">
			<el-input
				type="textarea"
				:rows="10"
				placeholder="请输入对应的奖项(可直接从excel复制)，一行一个,格式:奖品+空格+数量(数量不限制建议设置99999,默认为0)如：
一等奖 10
二等奖 20
三等奖 99999
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
			rewards.forEach((item) => {
				if (this.listStr.length) {
					this.listStr = this.listStr + '\n' + item.name + ' ' + item.num;
				} else {
					this.listStr = item.name + ' ' + item.num;
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
						item = item.replace(/\s+/g, ' ');
						let arr = item.split(' ');
						let name = arr[0];
						let num = arr.length >= 2 ? parseInt(arr[1]) : 0;
						num = isNaN(num) ? 0 : num;
						list.push({
							key: index + 1,
							name: name,
							num: num
						});
					}
				});
			}
			this.$db.set('rewards', list).write();
			// this.$db.set('result.RewardBox', []).write();
			// this.$db.set('result.RollReward', []).write();
			// this.$db.set('result.Gashapon', []).write();
			// this.$db.set('result.RollCallReward', []).write();
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
