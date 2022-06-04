<template>
	<page-meta page-style="background-color:#f7f7f7" background-color="#f7f7f7">

	</page-meta>
	<view style="background-color: #f7f7f7;">
		<u-notice-bar text="根据国家法律规定,寄件需要实名认证" mode="link"></u-notice-bar>
		<view class="list">
			<view class="card card-bg">
				<view class="cell" hover-class="hover-cell" hover-stay-time="70" @click="onClickCell('send')">
					<view class="tag tag-d" style="background-color: #5184fa;">
						寄
					</view>
					<view class="title-box" style="margin-left: 12rpx;">
						<view class="title">
							从哪里寄
						</view>
						<text class="title title-sub">
							{{list_data.send?list_data.send.name : '请填写寄件地址'}}
						</text>
					</view>
					<view class="right column" style="padding-right: 12rpx;gap: 6rpx;">
						<tui-icon name="addressbook" color="#999" size="24"></tui-icon>
						<view class="title title-mini">
							地址簿
						</view>
					</view>
				</view>


				<view class="border-box">
					<tui-icon class="icon" name="exchange" size="20"></tui-icon>
					<view class="border">
					</view>
				</view>
				<view class="cell" hover-class="hover-cell" hover-stay-time="70" @click="onClickCell('receive')">
					<view class="tag tag-d" style="background-color: coral;">
						收
					</view>
					<view class="title-box" style="margin-left: 12rpx;">
						<view class="title">
							到哪里去
						</view>
						<view class="title title-sub">
							{{list_data.receive?list_data.receive.name : '请填写收件地址'}}
						</view>
					</view>
					<view class="right column" style="padding-right: 12rpx;gap: 6rpx;">
						<tui-icon name="addressbook" color="#999" size="24"></tui-icon>
						<view class="title title-mini">
							地址簿
						</view>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="cell" hover-class="hover-cell" hover-stay-time="70" @click="onClickCell('itemInfo')">
					<view class="title title-sm">
						物品信息
					</view>
					<view class="tag" style="background-color: red;opacity: .5;margin-left: 12rpx;">必填</view>
					<view class="right">
						<view class="value">
							{{list_data.itemInfo?list_data.itemInfo : '电脑'}}
						</view>
						<tui-icon name="arrowright" size="24" color="#999"></tui-icon>
					</view>
				</view>
				<view class="border-box">
					<view class="border">

					</view>
				</view>
				<view class="cell" hover-class="hover-cell" hover-stay-time="70">
					<view class="title title-sm">
						付款方式
					</view>
					<view class="right">
						<view class="value">
							寄付现结
						</view>
						<tui-icon name="arrowright" size="24" color="#999"></tui-icon>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="cell" hover-class="hover-cell" hover-stay-time="70">
					<view class="title title-sm">
						保价
					</view>
					<view class="right">
						<view class="value">
							未保价物品最多赔付3倍运费
						</view>
						<tui-icon name="arrowright" size="24" color="#999"></tui-icon>
					</view>
				</view>
				<view class="border-box">
					<view class="border">

					</view>
				</view>
				<view class="cell" hover-class="hover-cell" hover-stay-time="70">
					<view class="title title-sm">
						增值服务
					</view>
					<view class="right">
						<view class="value">
							保密配送、贵重物品配送等
						</view>
						<tui-icon name="arrowright" size="24" color="#999"></tui-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom" style="border-radius: 12rpx 12rpx 0 0;">
			<view class="box flex" style="padding: 12rpx 36rpx;display: flex;width: 100%;">
				<view class="left column">
					<view class="flex" style="padding: 16rpx 0rpx;font-size: 32rpx;">
						<view style="font-weight: 500;">
							预估运费：
						</view>
						<view class="price">
							￥-.--
						</view>
					</view>

				</view>
				<view class="right flex">
					<tui-button type="warning" shape="circle" height="52rpx" :size="28" width="158rpx" @click="onPay">
						立即付款</tui-button>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		request
	} from '@/common/request'
	export default {
		data() {
			return {
				popupShow: true,
				list_data: {
					send: "",
					receive: "",
					itemInfo: ""
				}
			}
		},
		onShow() {
			// #ifdef APP-PLUS
			plus.navigator.setStatusBarStyle("dark")
			// #endif
		},
		onLoad() {

		},
		methods: {
			async onPay() {
				console.log(this.list_data)
				const res = await request('orders', 'newOrder', this.list_data);
				console.log(res)
				if (res.code) {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
					return;
				}
				uni.showToast({
					title: "提交成功",
					duration: 2000
				})
				setTimeout(() => {
					uni.navigateBack({

					})
				}, 2000)

			},
			onClickCell(type) {
				let that = this
				let urls = {
					send: "../offenAddress/offenAddress",
					receive: "../offenAddress/offenAddress",
					itemInfo: "../itemInfo/itemInfo"
				}
				console.log(1)
				if (!Object.keys(urls).includes(type)) {
					uni.showToast({
						title: "参数错误",
						icon: "none"
					})
				}
				console.log(2)
				uni.navigateTo({
					url: urls[type],
					success: (e) => {
						e.eventChannel.once("send_emit", (e) => {
							console.log(e)
							this.list_data[type] = e
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifdef H5 */
	page {
		background-color: #f7f7f7;
	}

	/* #endif */

	.list {
		margin: 12rpx 24rpx;
	}

	.card {
		margin: 18rpx 0;
		background-color: #fff;
		border-radius: 12rpx;
		padding: 16rpx 0rpx;
		box-shadow: 0 0 12rpx #ffffff22;

		.border-box {
			display: flex;
			align-items: center;
			margin: 0 36rpx;
			overflow: hidden;

			.icon {
				padding: 0 8rpx;
			}

			.border {
				background-image: linear-gradient(to right, #eee 50%, rgba(255, 255, 255, 0) 0%);
				background-position: bottom;
				background-size: 10px 1px;
				background-repeat: repeat-x;
				flex-grow: 1;
				height: 1px;
			}
		}

		.cell {
			display: flex;
			align-items: center;
			padding: 12rpx 24rpx;


			.value {
				font-size: 28rpx;
				color: #777;
				font-weight: 500;
			}


			.tag {
				border-radius: 12rpx;
				background-color: #000;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 24rpx;
				padding: 2rpx 12rpx;
			}

			.tag.tag-d {
				padding: 0;
				margin: 0 16rpx;
				height: 48rpx;
				width: 48rpx;
				font-size: 28rpx;
			}

			.title {
				font-size: 34rpx;
				color: #333;
				font-weight: 500;
			}

			.title.title-sm {
				font-size: 30rpx;
				color: #888;
				font-weight: 500;
			}

			.title-sub {
				margin-top: 12rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #777;
			}

			.title.title-mini {
				font-size: 24rpx;
				color: #999;
				font-weight: 300;
			}
		}
	}

	.card.card-bg {
		padding: 32rpx 0;
	}

	.bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box;
	}

	.left {
		margin: 0 auto 0 0;
		display: flex;
		align-items: center;
	}

	.right {
		margin: 0 0 0 auto;
		display: flex;
		align-items: center;

	}

	.column {
		display: flex;
		flex-direction: column;
	}

	.flex {
		display: flex;
		align-items: center;
	}

	.hover-cell {
		background-color: #eeeeee66;

	}

	.price {
		color: #d72d1b;
		font-weight: 500;
	}
</style>
