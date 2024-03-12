<template>
	<div>
		<el-dialog center :visible.sync="visible" :append-to-body="true" width="600px" class="rank" :close-on-click-modal="false">
			<div class="c-LotteryConfigtitle" slot="title">
				<span :style="{ fontSize: '16px', marginRight: '20px' }">用户管理</span>
				<el-button size="mini" type="primary" @click="onSubmit">配置用户</el-button>
			</div>
			<div class="container">
				<el-table :data="result" style="width: 100%">
					<el-table-column prop="name" label="姓名" width="180"></el-table-column>
					<el-table-column prop="store" label="积分"></el-table-column>
				</el-table>
			</div>
		</el-dialog>
		<Names ref="names"></Names>
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
		open() {
			this.visible = true;
			this.result = this.$db.get('users').value();
		},
		close() {
			this.visible = false;
		},
		onSubmit() {}
	}
};
</script>
<style lang="scss">
.el-table .warning-row {
	background: #d9dce4;
}
.el-table .info-row {
	background: #fec0a1;
}
.el-table .success-row {
	background: #fedb6b;
}
.rank {
	.el-dialog__body {
		height: 500px;
		.container {
			height: 100%;
			overflow-y: auto;
			padding: 0 10px;
		}
	}
}
.dialog-showAddLottery {
	.el-dialog {
		height: 186px;
	}
}
</style>
