<template>
	<view class="tui-drag__wrap" :list="list" :style="{ height: getHeight + 'rpx' }" :basedata="baseData" :change:list="handler.listObserver"
	 :change:basedata="handler.baseDataObserver">
		<!-- #ifdef MP-WEIXIN -->
		<view class="tui-drag__item" v-for="(item, index) in list" :key="item.id" :data-index="index" :style="{ width: 100 / columns + '%', height: itemHeight + 'rpx' }"
		 @longpress="handler.longPress" :data-basedata="baseData" :data-edit="isEdit" @touchstart="handler.touchStart"
		 :catch:touchmove="dragging?handler.touchMove:''" :catch:touchend="dragging?handler.touchEnd:''">
			<slot :entity="item.data" :fixed="item.fixed" :index="index" :height="itemHeight" :isEdit="isEdit"></slot>
		</view>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<view class="tui-drag__item" v-for="(item, index) in list" :key="item.id" :data-index="index" :style="{ width: 100 / columns + '%', height: itemHeight + 'rpx' }"
		 @longpress="handler.longPress" :data-basedata="baseData" :data-edit="isEdit" @touchstart="handler.touchStart"
		 @touchmove="handler.touchMove" @touchend="handler.touchEnd">
			<slot :entity="item.data" :fixed="item.fixed" :index="index" :height="itemHeight" :isEdit="isEdit"></slot>
		</view>
		<!-- #endif -->
	</view>
</template>
<script src="./tui-drag.wxs" lang="wxs" module="handler"></script>
<script>
	export default {
		name:'tuiDrag',
		emits: ['click','sortend','change'],
		props: {

			/*
			  数据源
			  约定属性 fixed（是否固定，表示此内容不可拖拽，也不可换位置）
			*/
			listData: {
				type: Array,
				default () {
					return [];
				}
			},
			// 列数
			columns: {
				type: Number,
				default: 3
			},
			// 顶部固定高度
			topSize: {
				type: Number,
				default: 0
			},
			// 底部固定高度
			bottomSize: {
				type: Number,
				default: 0
			},
			// 每个 item 高度, 用于计算 item-wrap 高度 rpx
			itemHeight: {
				type: Number,
				default: 0
			},
			// 页面滚动高度
			scrollTop: {
				type: Number,
				default: 0
			},
			//编辑状态：为true时才可拖拽
			isEdit: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				/* 未渲染数据 */
				baseData: {},
				platform: '', // 平台信息
				listWxs: [], // wxs 传回的最新 list 数据
				rows: 4, // 行数

				/* 渲染数据 */
				list: [], // 渲染数据列
				dragging: false
			};
		},
		watch: {
			listData(val){
				this.list = []
				setTimeout(() => {
					this.init()
				}, 0);
			},
			columns(val) {
				this.list = []
				setTimeout(() => {
					this.init()
				}, 0);
			}
		},
		computed: {
			getHeight() {
				return this.rows * this.itemHeight;
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			vibrate() {
				// #ifndef H5
				if (this.platform !== 'devtools') uni.vibrateShort();
				// #endif
			},
			pageScroll(e) {
				uni.pageScrollTo({
					scrollTop: e.scrollTop,
					duration:0
				});
			},
			drag(e) {
				this.dragging = e.dragging;
			},
			listChange(e) {
				this.listWxs = e.list;
			},
			itemClick(e) {
				let index = e.currentTarget.dataset.index;
				let item = this.listWxs[index];

				this.$emit('click', {
					key: item.realKey,
					data: item.data,
					extra: e.detail
				});
			},
			unique(n = 6) {
				let rnd = '';
				for (let i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
				return 'tui_' + new Date().getTime() + rnd;
			},
			/**
			 *  初始化获取 dom 信息
			 */
			initDom() {
				let {
					windowWidth,
					windowHeight,
					platform
				} = uni.getSystemInfoSync();
				let remScale = (windowWidth || 375) / 375;

				this.platform = platform;

				let baseData = {};
				baseData.windowHeight = windowHeight;
				baseData.realTopSize = (this.topSize * remScale) / 2;
				baseData.realBottomSize = (this.bottomSize * remScale) / 2;
				baseData.columns = this.columns;
				baseData.rows = this.rows;

				const query = uni.createSelectorQuery().in(this);
				query.select('.tui-drag__item').boundingClientRect();
				query.select('.tui-drag__wrap').boundingClientRect();
				query.exec(res => {
					if (res && res.length > 0 && res[0] && res[0].width) {
						baseData.itemWidth = res[0].width;
						baseData.itemHeight = res[0].height;
						baseData.wrapLeft = res[1].left;
						baseData.wrapTop = res[1].top + this.scrollTop;
						this.dragging = false;
						this.baseData = baseData;
					}
				});
			},
			/**
			 *  初始化函数
			 *  {listData, topSize, bottomSize, itemHeight} 参数改变需要手动调用初始化方法
			 */
			init() {
				// 初始必须为true以绑定wxs中的函数,
				this.dragging = true;
				let delItem = item => {
					let obj={...item}
					let fixed = obj.fixed || false;
					delete obj["fixed"];
					return {
						id: this.unique(),
						fixed: fixed,
						data: { 
							...obj
						}
					};
				};
				let listData = this.listData,
					_list = [];
				// 遍历数据源增加扩展项, 以用作排序使用
				listData.forEach((item, index) => {
					_list.push(delItem(item));
				});

				let i = 0,
					columns = this.columns;
				let list = (_list || []).map((item, index) => {
					item.realKey = i++; // 真实顺序
					item.sortKey = index; // 整体顺序
					item.tranX = `${(item.sortKey % columns) * 100}%`;
					item.tranY = `${Math.floor(item.sortKey / columns) * 100}%`;
					return item;
				});
				this.rows = Math.ceil(list.length / columns);
				this.list = list;
				console.log(list)
				this.listWxs = list;
				if (list.length === 0) return;

				// 异步加载数据时候, 延迟执行 initDom 方法, 防止无法正确获取 dom 信息
				setTimeout(() => this.initDom(), 1000);
			},
			sort_end(e) {
				this.$emit('sortend', {
					listData: e.listData
				});
			},
			change(e) {
				this.$emit('change', {
					listData: e.listData
				});
			}
		}
	};
</script>

<style scoped>
	.tui-drag__wrap {
		position: relative;
	}

	.tui-drag__wrap .tui-drag__item {
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
	}

	.tui-drag__transition {
		transition: transform 0.35s !important;
	}

	.tui-drag__wrap .tui-drag__current {
		z-index: 10 !important;
	}

	.tui-drag__wrap .tui-drag__fixed {
		z-index: 1 !important;
	}
</style>
