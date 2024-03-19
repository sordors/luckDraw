<template>
	<div>
		<el-dialog title="用户管理" center :visible.sync="visible" :append-to-body="true" width="800px" class="user" :close-on-click-modal="false">
			<el-row>
				<el-button size="mini" type="primary" @click="openNames">配置用户</el-button>
				<div class="file-data">
					<el-button size="mini" type="warning">读取文件</el-button>
					<input ref="file" type="file" class="file" @change="upload" />
				</div>
				<el-button size="mini" @click="saveData">保存配置</el-button>
			</el-row>
			<div class="container">
				<el-table :data="result" style="width: 100%">
					<el-table-column prop="name" label="姓名" width="180"></el-table-column>
					<el-table-column prop="integral" label="积分"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="primary" @click="addIntegral(scope.row.key, 1)">积分+1</el-button>
							<el-button size="mini" type="primary" @click="addIntegral(scope.row.key, 2)">积分+2</el-button>
							<el-button size="mini" type="primary" @click="addIntegral(scope.row.key, 3)">积分+3</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-dialog>
		<Names ref="names" @on-success="reset"></Names>
	</div>
</template>

<script>
var fs = require('fs');
const { dialog } = require('electron').remote;
import Names from './Names';
export default {
	components: { Names },
	data() {
		return {
			visible: false,
			result: []
		};
	},
	methods: {
		saveData(){
			let listStr = '';
			this.result.forEach((item) => {
				if (listStr.length) {
					listStr = listStr + '\n' + item.name + ' ' + item.integral;
				} else {
					listStr = item.name + ' ' + item.integral;
				}
			});
			this.saveTxtToFile(listStr);
		},
		saveTxtToFile(content) {
			// 弹出保存对话框，让用户选择保存路径
			dialog
				.showSaveDialog({
					title: '保存用户配置',
					defaultPath: '用户配置.txt', // 默认保存文件名
					filters: [{ name: 'Text Files', extensions: ['txt'] }] // 文件过滤器，限制保存为txt文件
				})
				.then((result) => {
					if (!result.canceled) {
						// 用户确认保存
						const filePath = result.filePath;
						fs.writeFile(filePath, content, (err) => {
							if (err) {
								console.error('保存文件出错:', err);
								return;
							}
							console.log('文件保存成功:', filePath);
						});
					} else {
						console.log('用户取消了保存操作');
					}
				})
				.catch((err) => {
					console.error('保存对话框出错:', err);
				});
		},
		upload() {
			let file = this.$refs.file.files[0];
			let _this = this;
			let reader = new FileReader();
			if (file) {
				reader.onload = (e) => {
					let listStr = e.target.result;
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

					this.result = list;
				};
				reader.readAsText(file);
			}
		},
		openNames() {
			this.$refs.names.open();
		},
		reset(e) {
			console.log('reset');
			this.result = this.$db.get('users').value();
		},
		open() {
			this.visible = true;
			this.result = this.$db.get('users').value();
		},
		close() {
			this.visible = false;
		},
		addIntegral(id, integral) {
			let user = this.$db.get('users').find({ key: id }).value();
			let newIntegral = parseInt(user.integral) + parseInt(integral);
			this.$db.get('users').find({ key: id }).assign({ integral: newIntegral }).write();
			this.$message({
				message: '修改成功',
				type: 'success'
			});
			this.result = this.$db.get('users').value();
		}
	}
};
</script>
<style lang="scss" scoped>
.el-table .warning-row {
	background: #d9dce4;
}
.el-table .info-row {
	background: #fec0a1;
}
.el-table .success-row {
	background: #fedb6b;
}
.user {
	.el-dialog__body {
		overflow: hidden;
		.container {
			height: 500px;
			overflow-y: auto;
			padding: 10px;
		}
	}
}
.dialog-showAddLottery {
	.el-dialog {
		height: 186px;
	}
}

.file-data {
	position: relative;
	overflow: hidden;
	display: inline-table;
	cursor: pointer;
}
.file {
	position: absolute;
	right: 0px;
	top: 0px;
	margin: 0px;
	padding: 0px;
	opacity: 0;
	z-index: 1;
	height: 100%;
	width: 100%;
	filter: alpha(opacity=0);
	font-size: 100px;
}
</style>
