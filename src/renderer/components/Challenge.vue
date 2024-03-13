<template>
	<div>
		<el-dialog title="选择挑战者" center :append-to-body="true" :visible.sync="showImport" class="challenge-dialog" width="600px" :close-on-click-modal="false">
			<el-select v-model="user" placeholder="请选择挑战者" style="width: 100%;">
				<el-option :label="item.name" :value="item.name" v-for="(item, index) in users"></el-option>
			</el-select>
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
			users: [],
			user: ''
		};
	},
	methods: {
		open() {
			this.showImport = true;
			this.users = this.$db.get('users').value();
		},
		close() {
			this.showImport = false;
		},
		sumbit() {
			this.showImport = false;
			this.$nextTick(() => {
				this.$emit('on-success', this.user);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.challenge-dialog {
	.footer {
		height: 50px;
		line-height: 50px;
		text-align: right;
	}
}
</style>
