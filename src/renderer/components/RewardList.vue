<template>
	<div>
		<el-dialog title="用户管理" center :visible.sync="visible" :append-to-body="true" width="800px" class="user" :close-on-click-modal="false">
			<el-row>
				<el-button size="mini" type="primary" @click="openRewards">配置奖品</el-button>
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
</style>
