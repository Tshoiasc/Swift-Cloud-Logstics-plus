<template>
	<view class="tui-grade__box" @touchmove="touchMove">
		<block v-for="(item, index) in quantity" :key="index">
			<view
				class="tui-icon__grade"
				:class="['tui-icon__star' + (index < intScore ? 'full' : '') + (decimalScore > 0 && index == intScore ? 'half' : '')]"
				@tap="touchMove"
				:style="{
					width: (width < size ? size : width) + 'px',
					fontSize: size + 'px',
					color: index < intScore || (decimalScore > 0 && index == intScore) ? active : normal
				}"
			></view>
		</block>
	</view>
</template>

<script>
export default {
	name: 'tuiGrade',
	emits: ['change'],
	props: {
		//数量
		quantity: {
			type: Number,
			default: 5
		},
		//当前评分，小数只支持0.5
		score: {
			type: [Number, String],
			default: 0
		},
		//禁用点击
		disabled: {
			type: Boolean,
			default: false
		},
		//星星大小 px
		size: {
			type: Number,
			default: 20
		},
		//星星宽度 px，大于等于size值，设置间距使用
		width: {
			type: Number,
			default: 20
		},
		//未选中颜色
		normal: {
			type: String,
			default: '#b2b2b2'
		},
		//选中颜色
		active: {
			type: String,
			default: '#e41f19'
		},
		//是否支持半星选择/展示
		isHalf: {
			type: Boolean,
			default: true
		},
		//超过多少比例选中半星（取值区间0~0.5）
		halfRate: {
			type: Number,
			default: 0.25
		},
		//自定义参数
		params: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			pageX: 0,
			intScore: 0,
			decimalScore: 0
		};
	},
	created() {
		this.starActive(this.score);
	},
	watch: {
		score(val) {
			this.starActive(val);
		}
	},
	methods: {
		starActive(val) {
			val = Number(val);
			let intVal = parseInt(val);
			let decimalVal = val % 1;
			if (!this.isHalf) {
				intVal = decimalVal > 0 ? intVal + 1 : intVal;
				decimalVal = 0;
			}
			this.intScore = intVal;
			this.decimalScore = decimalVal;
		},
		touchMove(e) {
			if (this.disabled || !e.changedTouches[0]) return;
			const movePageX = e.changedTouches[0].pageX;
			const distance = movePageX - this.pageX;
			let score = 0;
			if (distance > 0) {
				score = distance / this.width;
				let decimalScore = score % 1;
				if (!this.isHalf) {
					decimalScore = decimalScore > 0 ? 1 : 0;
				} else {
					if (decimalScore > this.halfRate) {
						decimalScore = decimalScore <= 0.5 ? 0.5 : 1;
					} else {
						decimalScore = 0;
					}
				}
				score = parseInt(score) + decimalScore;
				score = score > this.quantity ? this.quantity : score;
			}
			this.$emit('change', {
				score: score,
				params: this.params
			});
		}
	},
	mounted() {
		const className = '.tui-grade__box';
		let query = uni.createSelectorQuery().in(this);
		query
			.select(className)
			.boundingClientRect(res => {
				this.pageX = res.left || 0;
			})
			.exec();
	}
};
</script>

<style scoped>
@font-face {
	font-family: 'tuiGradeFont';
	src: url('data:font/truetype;charset=utf-8;base64,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')
		format('truetype');
	font-weight: normal;
	font-style: normal;
}
.tui-icon__grade {
	font-family: 'tuiGradeFont' !important;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	display: block;
	text-align: center;
}

.tui-icon__starfull:before {
	content: '\e9a1';
}

.tui-icon__star:before {
	content: '\e9a2';
}

.tui-icon__starhalf:before {
	content: '\e9a3';
}
.tui-grade__box {
	display: -webkit-inline-flex;
	display: inline-flex;
	align-items: center;
	margin: 0;
	padding: 0;
}
</style>
