<template>
	<div>
		<el-dialog title="奖项管理" center :visible.sync="visible" :append-to-body="true" width="800px" class="user" :close-on-click-modal="false">
			<el-row>
				<el-button size="mini" type="primary" @click="openRewards">配置奖品</el-button>
				<div class="file-data">
					<el-button size="mini" type="warning">读取文件</el-button>
					<input ref="file" type="file" class="file" @change="upload" />
				</div>
				<el-button size="mini" @click="saveData">保存配置</el-button>
			</el-row>
			<div class="container">
				<el-table :data="result" style="width: 100%">
					<el-table-column prop="name" label="奖品名称" width="180"></el-table-column>
					<el-table-column prop="num" label="数量"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="primary" @click="addNum(scope.row.key, 1)">奖品+1</el-button>
							<el-button size="mini" type="primary" @click="addNum(scope.row.key, 2)">奖品+2</el-button>
							<el-button size="mini" type="primary" @click="addNum(scope.row.key, 3)">奖品+3</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-dialog>
		<Rewards ref="rewards" @on-success="reset"></Rewards>
	</div>
</template>

<script>
var fs = require('fs');
const { dialog } = require('electron').remote;
import Rewards from './Rewards';
export default {
	components: { Rewards },
	data() {
		return {
			visible: false,
			result: []
		};
	},
	methods: {
		saveData() {
			let listStr = '';
			this.result.forEach((item) => {
				if (listStr.length) {
					listStr = listStr + '\n' + item.name + ' ' + item.num;
				} else {
					listStr = item.name + ' ' + item.num;
				}
			});
			this.saveTxtToFile(listStr);
		},
		saveTxtToFile(content) {
			// 弹出保存对话框，让用户选择保存路径
			dialog
				.showSaveDialog({
					title: '保存奖励配置',
					defaultPath: '奖励配置.txt', // 默认保存文件名
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

					this.result = list;
					this.$emit('on-reset',{});
				};
				reader.readAsText(file);
			}
		},
		openRewards() {
			this.$refs.rewards.open();
		},
		reset(e) {
			console.log('reset');
			this.result = this.$db.get('rewards').value();
		},
		open() {
			this.visible = true;
			this.result = this.$db.get('rewards').value();
		},
		close() {
			this.visible = false;
		},
		addNum(id, num) {
			let user = this.$db.get('rewards').find({ key: id }).value();
			let newNum = parseInt(user.num) + parseInt(num);
			this.$db.get('rewards').find({ key: id }).assign({ num: newNum }).write();
			this.$message({
				message: '修改成功',
				type: 'success'
			});
			this.result = this.$db.get('rewards').value();
			this.$emit('on-reset',{});
		}
	}
};
</script>
<style lang="scss" scoped>
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
