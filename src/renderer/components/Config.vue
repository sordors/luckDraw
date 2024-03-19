<template>
	<el-dialog :visible.sync="visible" :append-to-body="true" width="800px" class="c-LotteryConfig"
		:close-on-click-modal="false">
		<div class="c-LotteryConfigtitle" slot="title">
			<span :style="{ fontSize: '16px', marginRight: '20px' }">系统配置</span>
		</div>
		<div class="container">
			<el-form ref="form" :model="config" size="mini">
				<el-form-item label="启动软件是否清空抽奖结果">
					<el-radio v-model="config.refresh" :label="1">清空</el-radio>
					<el-radio v-model="config.refresh" :label="2">不清空</el-radio>
				</el-form-item>
				<el-form-item label="是否允许重复点名">
					<el-radio v-model="config.rollcall" :label="1">是</el-radio>
					<el-radio v-model="config.rollcall" :label="2">否</el-radio>
				</el-form-item>

				<el-form-item label="答题时间(秒)"><el-input type="number" v-model="config.time" :min="1"
						:step="1"></el-input></el-form-item>
				<el-form-item label="随机抽奖(扣除积分)"><el-input type="number" v-model="config.roll_integral" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="随机抽奖(中奖率)"><el-input type="number" v-model="config.roll_rate" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="随机点名抽奖(中奖率,PS:此功能无扣除积分功能)"><el-input type="number" v-model="config.roll_call_rate"
						:min="0" :step="1"></el-input></el-form-item>
				<el-form-item label="扭蛋(扣除积分)"><el-input type="number" v-model="config.egg_integral" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="扭蛋(中奖率)"><el-input type="number" v-model="config.egg_rate" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="开箱(扣除积分)"><el-input type="number" v-model="config.box_integral" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="开箱(中奖率)"><el-input type="number" v-model="config.box_rate" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="炫酷抽奖(扣除积分)"><el-input type="number" v-model="config.cool_integral" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="炫酷抽奖(中奖率)"><el-input type="number" v-model="config.cool_rate" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="十连抽(最小抽中奖池奖品次数)"><el-input type="number"
						v-model="config.card_mini_rewrad" :min="0" :step="1"></el-input></el-form-item>
				<el-form-item label="十连抽(最大抽中奖池奖品次数)"><el-input type="number"
						v-model="config.card_max_rewrad" :min="0" :step="1"></el-input></el-form-item>
				<el-form-item label="十连抽(保底奖励抽中次数)"><el-input type="number" v-model="config.card_base_rewrad" :min="0"
						:step="1"></el-input></el-form-item>
				<el-form-item label="十连抽(扣除积分)"><el-input type="number" v-model="config.card_base_integral" :min="0"
						:step="1"></el-input></el-form-item>
			</el-form>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="close()">取 消</el-button>
			<el-button type="primary" @click="onSubmit">保存配置</el-button>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		data() {
			return {
				visible: false,
				config: {
					refresh: 1,
					rollcall: 1,
					time: 30,
					roll_integral: 0,
					roll_rate: 100,
					roll_call_rate: 100,
					egg_integral: 0,
					egg_rate: 100,
					box_integral: 0,
					box_rate: 100,
					cool_integral: 0,
					cool_rate: 100,
					card_mini_rewrad: 1,
					card_max_rewrad: 1,
					card_base_rewrad: 1,
					card_base_integral: 0
				}
			};
		},
		methods: {
			open() {
				this.visible = true;
				this.config = this.$db.get('config').value();
			},
			close() {
				this.visible = false;
			},
			onSubmit() {
				this.$db.set('config', this.config).write();

				this.$message({
					message: '保存成功',
					type: 'success'
				});

				this.$nextTick(() => {
					this.$emit('on-reset');
					this.visible = false;
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.c-LotteryConfig {
		.el-dialog__body {
			overflow: hidden;

			.container {
				height: 500px;
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