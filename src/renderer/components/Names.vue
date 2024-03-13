<template>
	<div>
		<el-dialog :append-to-body="true" :visible.sync="showImport" class="import-dialog" width="600px" :close-on-click-modal="false">
			<el-input
				type="textarea"
				:rows="10"
				placeholder="请输入对应的用户(可直接从excel复制)，一行一个,格式:名字+空格+积分(积分不填默认为0)。如：
张三 2
李四 3
王五 4
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
			let users = this.$db.get('users').value();
			this.listStr = '';
			users.forEach((item) => {
				if (this.listStr.length) {
					this.listStr = this.listStr + '\n' + item.name + ' ' + item.integral;
				} else {
					this.listStr = item.name + ' ' + item.integral;
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
						let arr = item.split(" ");
						let name = arr[0];
						let integral = arr.length >= 2 ? parseInt(arr[1]) : 0;
						integral = isNaN(integral) ? 0 : integral;
						list.push({
							key: index + 1,
							name: name,
							integral: integral
						});
					}
				});
			}
			this.$db.set('users', list).write();
			this.$db.set('result.RollCall', []).write();
			this.$db.set('result.RollCallReward', []).write();
			this.$message({
				message: '保存成功',
				type: 'success'
			});
			this.$emit('on-success',{});
			this.showImport = false;
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
