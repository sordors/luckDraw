<template>
	<el-dialog title="排行榜" center :visible.sync="visible" :append-to-body="true" width="600px" class="rank"  :close-on-click-modal="false">
		<div class="container">
			<el-table :data="result" style="width: 100%" :row-class-name="tableRowClassName">
				<el-table-column label="排名" width="180">
					<template slot-scope="scope">
						<span>NO.{{ scope.row.ranking }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="180"></el-table-column>
				<el-table-column prop="store" label="积分"></el-table-column>
			</el-table>
		</div>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			visible: false,
			result: []
		};
	},
	methods: {
		tableRowClassName({ row, rowIndex }) {
			console.log(123);
			if (rowIndex === 0) {
				return 'success-row';
			} else if (rowIndex === 1) {
				return 'warning-row';
			} else if (rowIndex === 2) {
				return 'info-row';
			}
			return '';
		},
		open() {
			this.visible = true;
			this.result = this.$db.get('rank').value();
		},
		close() {
			this.visible = false;
		},
		onSubmit() {}
	}
};
</script>
<style lang="scss" scoped>
.el-table .warning-row {
	background: #D9DCE4;
}
.el-table .info-row {
	background: #FEC0A1;
}
.el-table .success-row {
	background: #FEDB6B;
}
.rank {
	.el-dialog__body {
		height: 500px;
		overflow: hidden;
		.container {
			height: 100%;
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
</style>
