<template>
	<page-meta style="overflow: hidden;">
	</page-meta>
	<view style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;overflow: hidden;">
		<!-- <view class="statusbar" v-if="systemInfo.safeArea.top" :style="{height:systemInfo.safeArea.top+'px'}"></view> -->
		<!-- #ifdef MP -->
		<tui-navigation-bar id="bar" @init="initNavigation" @change="opacityChange" :scrollTop="scrollTop" title="首页"
			backgroundColor="#fff" color="#000" isFixed>
			<view class="tui-header"
				:style="{ paddingTop:barParam.statusBarHeight+'px' , height:(barParam.height - barParam.statusBarHeight)+'px'}">
				<view class="tui-category" hover-class="opcity" :hover-stay-time="150" @tap="classify">
					<view class="icon">
					</view>
					<view class="title">
						我的快递
					</view>
				</view>


			</view>

		</tui-navigation-bar>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<view class="headers" :style="{ top : barParam.height + 'px'}">
			<!-- #endif -->

			<!-- #ifndef  MP-WEIXIN -->
			<view class="headers" :style="{ top : systemInfo.statusBarHeight + 'px'}">
				<!-- #endif -->
				<tui-searchbar radius="16px" placeholder="搜索" height="32px" backgroundColor="#fff"
					inputBgColor="#f7f7f7"></tui-searchbar>
				<tui-tab :tabs="tabs.map(a=>a.title)" scroll :current="current_tab" color="#555" selectedColor="#333"
					bold sliderBgColor="#ffd150" sliderHeight="4px" @change="onChange" style="height: 80rpx;"></tui-tab>
			</view>

			<!-- #ifndef  MP-WEIXIN -->
			<view class="container" :style="{ top : ( systemInfo.statusBarHeight + 88) + 'px'}">
				<!-- #endif -->
				<!-- #ifdef  MP-WEIXIN -->
				<view class="container" :style="{ top : (barParam.height + 88) + 'px'}">
					<!-- #endif -->
					<view>
						<!-- 					<scroll-view scroll-x="true" class="tab-h" v-bind:scroll-into-view="scroll_into"
						v-bind:scroll-with-animation="true">
						<view v-for="(item, index) in tabs" class="tab-item"
							v-bind:class="current_tab==index ? 'tab-bar-active' : ''" v-bind:key="index"
							v-bind:data-current="index" v-bind:id="item.id" v-on:click="change_tab">{{item}}</view>
					</scroll-view> -->
						<view class="hr"></view>
						<swiper class="swiper" v-bind:current="current_tab" duration="300" @change="change_swiper"
							circular :style="{height:(systemInfo.windowHeight  - topDis - 88) + 'px'}">

							<swiper-item v-for="(key,index) in tabs.map(a=>a.type)"
								style="-webkit-overflow-scrolling:touch;overflow: scroll;height: 100%;background-color: #f7f7f7;">
								<scroll-view @refresherrestore="onRestoreRefresh" :refresher-triggered="refreshing"
									refresher-enabled :scroll-y="true" @refresherrefresh="onRefresh(key)"
									style="height: 100%;background-color: #f7f7f7;">
									<view class="card_list" v-for="dat in rend.get(orders,key)"
										v-if="rend.canShow(orders,key)">
										<orderCard :staff="false" :data="dat" @toDetail="toDetail(dat)"></orderCard>

										<!-- #ifdef MP-WEIXIN || H5 -->
										<view class="" v-if="dat.length == rend.get(orders,key).length"
											style="height: 88px;">

										</view>
										<!-- #endif -->

									</view>


									<tui-no-data
										imgUrl="https://www.thorui.cn/h5/static/images/toast/img_noorder_3x.png" v-else>
										暂无订单</tui-no-data>

								</scroll-view>


							</swiper-item>

						</swiper>

					</view>

				</view>

			</view>

</template>

<!-- #ifdef APP-PLUS || H5 -->
<script module="rend" lang="renderjs">
	export default {
		methods: {
			get(orders, key) {
				if (!orders) return []
				// console.log(orders)
				if (orders[key] && orders[key].list) {
					return orders[key].list
				} else {
					return []
				}
				console.log(orders[key], key)
			},
			canShow(orders, key) {
				// console.log(orders[key].list.length)

				if (orders[key] && orders[key].list && orders[key].list.length) {
					return true;
				}
				return false
			}
		}
	}
</script>
<!-- #endif -->
<!-- #ifdef MP-WEIXIN -->
<script module="rend" lang="wxs">
	module.exports = {
		get: function get(orders, key) {
			if (orders[key]) {
				return orders[key].list
			} else {
				return []
			}
			console.log(orders[key], key)
		},
		canShow: function(orders, key) {
			// console.log(orders[key].list.length)
			if (orders[key] && orders[key].list && orders[key].list.length) {
				return true;
			}
			return false
		}
	}
</script>
<!-- #endif -->

<script>
	import {
		// mapActions,
		// mapState,
		mapGetters,
		// mapMutations
	} from 'vuex';
	import orderCard from './order_app/orderCard.nvue';
	import {
		request
	} from '@/common/request'
	export default {
		computed: {
			...mapGetters({
				orders: "user/orders"
			})
		},
		components: {
			orderCard
		},
		data() {
			return {
				refreshing: false,
				// 当前选中tab索引
				current_tab: 0,
				// 当前滚动条距离左边的位置
				scroll_left: 0,
				// 当前滚动条滚动到id位置
				scroll_into: '',
				topDis: 0,
				// 屏幕宽度
				screen_width: 0,
				tabs: [{
					title: '我寄件',
					type: "send"
				}, {
					title: '我收件',
					type: "recieve"
				}, {
					title: '待支付',
					type: "pay"
				}],
				opacity: 1,
				top: 0,
				barParam: {},
				systemInfo: {},
				scrollTop: 0,
				opacity: 0,
				kefu: [{
					img: "https://img1.baidu.com/it/u=3487609233,3960044478&fm=253&fmt=auto&app=138&f=JPEG?w=601&h=500",
					name: "王韵达"
				}, {
					img: "https://img1.baidu.com/it/u=3487609233,3960044478&fm=253&fmt=auto&app=138&f=JPEG?w=601&h=500",
					name: "李顺丰"
				}, {
					img: "https://img1.baidu.com/it/u=3487609233,3960044478&fm=253&fmt=auto&app=138&f=JPEG?w=601&h=500",
					name: "张圆通"
				}, {
					img: "https://img1.baidu.com/it/u=3487609233,3960044478&fm=253&fmt=auto&app=138&f=JPEG?w=601&h=500",
					name: "赵申通"
				}, {
					img: "https://img1.baidu.com/it/u=3487609233,3960044478&fm=253&fmt=auto&app=138&f=JPEG?w=601&h=500",
					name: "韩邮政"
				}],
				card: [{
						img: {
							url: "/static/images/news/avatar_1.jpg"
						},
						title: {
							text: "CSDN云计算"
						},
						tag: {
							text: "1小时前"
						},
						header: {
							bgcolor: "#F7F7F7",
							line: true
						}
					},
					{
						img: {
							url: "/static/images/news/avatar_2.jpg",
							width: 56,
							height: 56,
							circle: true
						},
						title: {
							text: "王韵达",
							color: "#333",
							size: 28
						},
						tag: {
							text: "1小时前",
							color: "#999",
							size: 24
						}
					},
					{
						img: {
							url: "/static/images/news/avatar_1.jpg",
							circle: true
						},
						title: {
							text: "JavaScript"
						},
						tag: {
							text: "昨天"
						},
						header: {
							line: true,
							bgcolor: "#F7F7F7"
						}
					},
					{
						header: {
							line: true
						}
					}
				]

			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.screen_width = res.screenWidth
					console.log(this.orders, this.tabs[0])
				}
			});
			this.systemInfo = uni.getSystemInfoSync()
			// #ifndef MP
			this.topDis = this.systemInfo.safeArea.top
			// #endif

		},
		methods: {
			toDetail: function(e) {
				console.log(e)
				uni.navigateTo({
					url: "./maps/maps?_id=" + e._id
				})
			},
			onRestoreRefresh() {
				this.refreshing = false
			},
			async onRefresh(key) {
				this.refreshing = true
				const res = await request('orders', 'getOrders', {
					current: 0,
					page: 20,
					type: key

				}, {
					showLoading: false
				});
				console.log(res)
				this.$store.commit("user/setOrder", {
					type: key,
					list: res.data
				})
				uni.showToast({
					title: "刷新成功",
					icon: "none"
				})
				this.refreshing = false
			},
			move(e) {},
			// 点击tabbar事件
			change_tab(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.run_tab(index)
			},
			// swiper滑动事件
			change_swiper(e) {
				let index = e.target.current || e.detail.current;
				this.run_tab(index)
			},
			// 执行整个tab事件
			run_tab(index) {
				// 记录当前滑动的位置
				this.current_tab = index
				// 如果点击了第4个以后的,滚动条向右移动屏幕的宽度
				// this.scroll_into = this.tab_bar[index].id
			},
			change() {

			},
			onChange(e) {
				this.current_tab = e.index
				console.log(e)
			},
			initNavigation(e) {
				this.barParam = e
				console.log(this.barParam)
				// #ifdef MP
				this.topDis = e.height
				// #endif

				// this.opacity = e.opacity;
				// this.top = e.top;

				// this.topContainerTop = e.height
				// this.height = e.height - e.statusBarHeight
			},
			opacityChange(e) {
				this.opacity = e.opacity;
			},
		}

	};
</script>

<style lang="scss">
	.statusbar {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		background-color: #fff;
		z-index: 9999999999;
	}

	.tab-h {
		height: 80rpx;
		width: 100%;
		line-height: 80rpx;
		background: #fff;
		font-size: 16px;
		white-space: nowrap;

	}

	.tab-item {
		padding: 0 36rpx;
		display: inline-block;
	}

	.tab-bar-active {
		font-weight: bold;
		color: #feaf62;
	}

	.hr {
		height: 1rpx;
		background-color: #fff;
	}

	.swiper {
		height: 500rpx;
		text-align: center;

	}

	.swiper-item {
		height: 500rpx;
		line-height: 500rpx;
	}


	.scroll_view::-webkit-scrollbar {
		display: none;
	}

	.headers {
		z-index: 99999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		// height: 200rpx;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 460rpx;
		// background-image: linear-gradient(to bottom, #fbeacf, #fbeacf00);
	}

	.tui-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		box-sizing: padding-box;

		.tui-category {
			position: relative;
			display: flex;
			flex-direction: row;
			width: 100%;
			height: 100%;
			align-items: center;
			// height: 100%;
			justify-content: center;

			.icon {
				position: absolute;
				left: 12rpx;
				top: 0;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.title {
				justify-self: center;
				color: #333;

			}
		}
	}

	.title-box {
		height: 64rpx;

		image {
			background-color: 50%;
			height: 100%;
		}
	}

	.container {
		padding-top: 24rpx;
		// background-color: #f7f7f7;
		position: absolute;
		right: 0;
		left: 0;

		.card_list {
			padding: 0 24rpx;
			padding-top: 12rpx;
		}
	}

	.card {
		margin: 24rpx 0;
		background-color: #fff;
	}

	.card_list {
		background-color: #f7f7f7;
	}

	.tui-title {
		width: 100%;
		padding: 70rpx 30rpx 30rpx 30rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		line-height: 30rpx;
		color: #666;
		border-bottom: 1rpx solid #eee;
	}

	.tui-sub-default {
		padding: 12rpx 30rpx;
		color: #999;
		border-top: 1rpx solid #eee;
		font-size: 24rpx;
	}

	.card_box {
		padding-bottom: 24px;
	}

	.tui-default {
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		color: #333;
	}
</style>
