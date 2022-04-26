<template>
	<view class="container">
		<view class="tui-flex">
			<view class="tui-cube-box" @tap='log'>
				<view class="tui-cube tui-cube-1">云极速递+</view>
				<view class="tui-cube tui-cube-2">V{{version}}</view>
				<view class="tui-cube tui-cube-3">云极速递+</view>
				<view class="tui-cube tui-cube-4">V{{version}}</view>
				<view class="tui-cube tui-cube-5">云极速递+</view>
				<view class="tui-cube tui-cube-6">V{{version}}</view>
			</view>

		</view>
		<view class="tui-content-box">
			<!-- #ifdef MP-WEIXIN -->
			<view class="tui-content">尊敬的用户，欢迎使用云极速递+小程序！</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="tui-content">尊敬的用户，欢迎使用云极速递+App！</view>
			<!-- #endif -->

			<view class="tui-content">该项目（项目介绍）</view>
			<view class="tui-content tui-content-email" @tap="copy('admin@qsin.cn','邮箱已复制')">邮箱：admin@qsin.cn</view>
			<!-- #ifdef APP-PLUS -->
			<view class="tui-footer">
				<!-- <image src='/static/images/my/applets.jpg' class="tui-applets" mode="widthFix"></image> -->
				<view class="tui-footer-text">您也可体验微信小程序版本</view>
			</view>
			<!-- #endif -->

		</view>

	</view>
</template>

<script>
	import thorui from '@/components/common/tui-clipboard/tui-clipboard.js'
	import {
		mapState
	} from 'vuex'
	export default {
		computed: mapState(['version']),
		data() {
			return {

			}
		},
		methods: {
			copy: function(text, msg) {
				const that = this
				thorui.getClipboardData(text, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.tui.toast(msg)
					} else {
						this.tui.toast("内容复制失败")
					}
					// #endif
				})
			},
			log: function() {
				uni.navigateTo({
					url: '../log/log'
				})
			},
			openThorUI() {
				// #ifdef MP-WEIXIN
				wx.navigateToMiniProgram({
					appId: 'wxd3c1da92cb8fcf40'
				});
				// #endif
				// #ifndef  MP-WEIXIN
				if (this.sweixin) {
					this.sweixin.launchMiniProgram({
						id: 'gh_78d54c9830d3'
					});
				} else {
					uni.previewImage({
						urls: ['https://thorui.cn/img/applets_extend.jpg']
					});
				}
				// #endif
			}
		}
	}
</script>

<style>
	.container {
		padding: 0 50rpx 40rpx 50rpx;
		box-sizing: border-box;
	}

	.tui-flex {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 40px;
	}

	.tui-cube-box {
		width: 240rpx;
		height: 240rpx;
		position: relative;
		margin-top: 54rpx;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		animation: tui-go 4s linear infinite;
		z-index: 99;
	}

	@keyframes tui-go {
		0% {
			-webkit-transform: rotateX(0) rotateY(0);
			transform: rotateX(0) rotateY(0);
		}

		100% {
			-webkit-transform: rotateX(360deg) rotateY(360deg);
			transform: rotateX(360deg) rotateY(360deg);
		}
	}

	.tui-cube {
		width: 240rpx;
		height: 240rpx;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #fff;
		opacity: .9;
		text-align: center;
		/* word-break: break-all;
		word-wrap: break-word; */
	}

	.tui-cube-1 {
		background-color: #fff;
		-webkit-transform: rotateY(90deg) translateZ(-120rpx);
		transform: rotateY(90deg) translateZ(-120rpx);
		color: #333 !important;
	}

	.tui-cube-2 {
		background-color: #8a5966;
		-webkit-transform: rotateY(90deg) translateZ(120rpx);
		transform: rotateY(90deg) translateZ(120rpx);
	}

	.tui-cube-3 {
		background-color: #5c8dff;
		-webkit-transform: rotateX(90deg) translateZ(120rpx);
		transform: rotateX(90deg) translateZ(120rpx);
	}

	.tui-cube-4 {
		background-color: #ed3f14;
		-webkit-transform: rotateX(90deg) translateZ(-120rpx);
		transform: rotateX(90deg) translateZ(-120rpx);
	}

	.tui-cube-5 {
		background-color: #ff7900;
		-webkit-transform: translateZ(120rpx);
		transform: translateZ(120rpx);
	}

	.tui-cube-6 {
		background-color: #19be6b;
		-webkit-transform: translateZ(-120rpx);
		transform: translateZ(-120rpx);
	}

	.tui-content-box {
		width: 100%;
		margin-top: 50px;
		padding: 30rpx;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx #eee;
	}

	.tui-content {
		color: #333;
		font-size: 30rpx;
		line-height: 44rpx;
		padding: 10rpx 0;
		text-align: justify;
	}

	.tui-content-email {
		color: #5677fc !important;
	}

	.tui-footer {
		display: flex;
		align-items: center;
		padding-top: 30rpx;
	}

	.tui-applets {
		width: 80px;
		height: 80px;
		display: block;
	}

	.tui-footer-text {
		font-size: 24rpx;
		color: #999;
		padding-left: 20rpx;
		width: 300rpx;
	}
</style>
