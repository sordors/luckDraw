<template>
	<div>
		<el-dialog title="题库配置" center :append-to-body="true" :visible.sync="showImport" class="import-dialog" width="600px" :close-on-click-modal="false">
			<el-alert title="点击上传为在当前题库内新增数据,如需清空之前的数据,请先按重置按钮之后在操作" type="success" :closable="false"></el-alert>
			<div class="container">
				<el-form ref="form" size="mini">
					<el-form-item label="上传题库">
						<div class="file-data">
							<el-button size="small" type="primary">选择题库</el-button>
							<input ref="file" type="file" class="file" @change="upload" />
						</div>
					</el-form-item>
					<el-form-item label="重置题库">
						<div class="file-data"><el-button size="small" type="primary" @click="reset">清空数据</el-button></div>
					</el-form-item>
					<el-form-item>当前题库:{{ length }}条</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import XLSX from 'xlsx';
export default {
	data() {
		return {
			showImport: false,
			length: 0
		};
	},
	methods: {
		open() {
			this.showImport = true;
			this.length = this.$subjectDb.get('data').value().length;
		},
		close() {
			this.showImport = false;
		},
		fileChange(file, fileList) {
			console.log(file);
			console.log(fileList);
		},
		upload() {
			let file = this.$refs.file.files[0];
			let _this = this;
			let reader = new FileReader();
			if (file) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				reader.readAsBinaryString(file);
				reader.onload = e => {
					const bstr = e.target.result;
					const wb = XLSX.read(bstr, { type: 'binary' });
					/* 获取文件的第一个工作表（WorkSheet） */
					const wsname = wb.SheetNames[0];
					const ws = wb.Sheets[wsname];
					/* 数组转换 */
					const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
					/* 进行表格数据更新 */
					let subject = [];
					data.forEach((item, index) => {
						if (index !== 0 && item.length == 6) {
							subject.push({
								title: item[0] || '',
								result: item[5].toUpperCase() || '',
								answers: [
									{
										key: 'A',
										desc: item[1] || ''
									},
									{
										key: 'B',
										desc: item[2] || ''
									},
									{
										key: 'C',
										desc: item[3] || ''
									},
									{
										key: 'D',
										desc: item[4] || ''
									}
								]
							});
						}
					});

					this.$subjectDb
						.get('data')
						.push(...subject)
						.write();
					loading.close();
					this.$message.success('成功导入数据' + subject.length + '条');
					this.length = this.$subjectDb.get('data').value().length;
					this.$nextTick(() => {
						this.$emit('on-reset');
					});
				};
			}
		},
		reset() {
			this.$subjectDb.set('data', []).write();
			this.$nextTick(() => {
				this.$emit('on-reset');
			});
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
	.el-dialog__body {
		height: 340px;
		.container {
			height: 100%;
			overflow-y: auto;
			padding: 0 10px;
			margin-top: 20px;
		}
	}
}
.file-data {
	width: 160px;
	position: relative;
	overflow: hidden;
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
