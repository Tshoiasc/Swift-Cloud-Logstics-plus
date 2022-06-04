<template name="orderDetailComp">
	<view class="container">
		<view class="tui-order-header">
			<view class="tui-text">订单编号：
				<text class="tui-bold">{{info._id}}</text>
			</view>
			<view class="tui-text">国内承运：云极速递</view>
			<view class="tui-text">订单发往：
				<text
					class="tui-bold">{{info.receive.area.address_components.province}}{{info.receive.area.address_components.city}}{{info.receive.area.address_components.district}}</text>
			</view>
		</view>
		<view class="tui-order-tracking">
			<tui-time-axis>
				<view v-for="(item,index) in bz">
					<tui-timeaxis-item backgroundColor="transparent">
						<template v-slot:node>
							<view class="tui-node" :style="index == 0?('background-color:'+backgroundColor):''">
								<tui-icon :name="item.icon" color="#fff" :size="13"></tui-icon>
							</view>
						</template>
						<template v-slot:content>
							<view :class="'tui-order-title '+(index == 0?'':'tui-gray')">{{item.title}}</view>
							<view :class="'tui-order-desc  '+(index == 0?'':'tui-light-gray')">
								{{item.obj[0].text}}
							</view>
							<view class="tui-order-time tui-gray">{{formatDate(item.obj[0].time)}}</view>
						</template>
					</tui-timeaxis-item>

					<tui-timeaxis-item backgroundColor="transparent" v-for="(obji,ind) in item.obj.slice(1)"
						v-if="item.obj.length > 1">
						<template v-slot:node>
							<view class="tui-node-dot"></view>
						</template>

						<template v-slot:content>
							<view class="tui-order-desc tui-light-gray tui-ptop"
								style="line-height: 38rpx;">
								{{obji.text}}
							</view>
							<view class="tui-order-time tui-gray">{{formatDate(obji.time)}}
							</view>
						</template>
					</tui-timeaxis-item>
				</view>

			</tui-time-axis>
		</view>
	</view>
</template>

<script>
	import utils from '@/components/common/tui-utils/tui-utils.js'
	export default {
		props: {
			info: {
				type: Object,
				value: {}
			}
		},
		data() {
			return {
				bz: [],
				backgroundColor: "#5677fc"
			}
		},
		watch: {
			info: {
				handler(e) {
					this.handleStatus(e)
				},
				immediate: true
			}
		},
		methods: {
			formatDate(time) {
				if (time) {
					let val = utils.formatDate("y-m-d h:i:s", new Date(time), 4, true);
					return val
				} else {
					return ""
				}
			},
			handleStatus(data) {
				let zd = [{
					icon: "check",
					title: "已签收"
				}, {
					icon: "clock",
					title: "派送中"
				}, {
					icon: "transport",
					title: "运送中"
				}, {
					icon: "bag-fill",
					title: "已揽收"
				}, {
					icon: "edit",
					title: "已提交"
				}]
				let result = []
				switch (data.status) {
					case "sign":
						result.push({
							...zd[0],
							obj: [{
								text: "您的包裹已签收"
							}]
						})
					case "delivery":
						result.push({
							...zd[1],
							obj: data.progress.filter(a => (a.type == 'delivery' || a.type == 'undelivery')).map(
								a => {
									return {
										text: a.type == 'delivery' ? `您的包裹正在派送中,派送员${a.userInfo.nickname}` :
											'本次派送失败，请再次预约时间派送',
										time: a.time
									}
								}).reverse()
						})
					case "transport":
						result.push({
							...zd[2],
							obj: data.progress.filter(a => a.type == 'verify').map(a => {
								return {
									text: `您的包裹已抵达${a.office.name},由${a.userInfo.nickname}完成验视`,
									time: a.time
								}
							}).reverse()
						})
					case "send":
						result.push({
							...zd[3],
							obj: [{
									text: `您的包裹已被${data.bind_info.detailData.office.name}揽收,操作人:${data.bind_info.detailData.userInfo.nickname}`
								}

							]
						})
					case "submit":
						result.push({
							...zd[4],
							obj: [{
								text: "您的包裹已提交"
							}]
						})
					default:

				}
				this.bz = result


			},
		}
	}
</script>

<style scoped>
	.tui-order-header {
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-text {
		font-size: 28rpx;
		color: #333;
		padding: 4rpx;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-node {
		height: 44rpx;
		width: 44rpx;
		border-radius: 50%;
		background-color: #ddd;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		flex-shrink: 0;
	}

	.tui-node-dot {
		height: 16rpx;
		width: 16rpx;
		background-color: #ddd;
		border-radius: 50%;
		/* transform: translateY(45%); */
		margin-top: 6rpx;
	}

	.tui-bg-primary {
		background: #EB0909 !important;
	}

	.tui-order-tracking {
		padding: 30rpx 30rpx 30rpx 40rpx;
		background: #fff;
		margin-top: 20rpx;
		box-sizing: border-box;
	}

	.tui-order-title {
		padding-bottom: 12rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}

	.tui-order-desc {
		padding-bottom: 12rpx;
		font-size: 28rpx !important;
		color: #333;
	}

	.tui-ptop {
		display: flex;
		justify-content: flex-start;
		line-height: 28rpx;
	}

	.tui-order-time {
		font-size: 24rpx;
		font-weight: bold;
	}

	.tui-gray {
		color: #848484 !important;
	}

	.tui-light-gray {
		color: #888 !important;
	}

	.tui-primary {
		color: #5677fc;
	}
</style>
