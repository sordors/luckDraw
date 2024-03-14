<template>
	<div>
		<el-dialog title="用户管理" center :visible.sync="visible" :append-to-body="true" width="800px" class="user" :close-on-click-modal="false">
			<el-row>
				<el-button size="mini" type="primary" @click="openNames">配置用户</el-button>
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
</style>
