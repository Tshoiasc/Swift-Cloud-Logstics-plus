<template>
	<page-meta style="overflow: hidden;">

	</page-meta>
	<view class="container" :style="{ paddingTop : systemInfo.safeArea.top + 'px'}">
		<!-- #ifndef MP -->
		<view class="tui-header">
			<view>云极速递+</view>
			<tui-icon name="shut" :size="26" @click="back"></tui-icon>
		</view>
		<!-- #endif -->
		<view class="tui-page-title">登录</view>
		<view class="tui-form">
			<view class="tui-view-input">
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="people" color="#6d7a87" :size="20"></tui-icon>

						<input :adjust-position="false" v-model="username" placeholder="请输入用户名"
							placeholder-class="tui-phcolor" type="text" maxlength="11" />
						<view class="tui-icon-close" v-show="username" @tap="clearInput(1)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
						<input :adjust-position="false" v-model="password" placeholder="请输入密码" :password="true"
							placeholder-class="tui-phcolor" type="text" maxlength="36" />
						<view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent" v-if="captchaBase64"
					style="display: flex; align-items: center;">
					<view class="tui-cell-input">
						<tui-icon name="mobile" color="#6d7a87" :size="20"></tui-icon>

						<input :adjust-position="false" v-model="captcha" placeholder="请输入验证码"
							placeholder-class="tui-phcolor" type="text" maxlength="11" />
						<view class="tui-icon-close" v-show="captcha" @tap="clearInput(3)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
					<image class="captcha-img" @click="createCaptcha" :src="captchaBase64" mode="widthFix"></image>
				</tui-list-cell>
			</view>
			<view class="tui-cell-text">
				<!-- 				<view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="toRetrievePwd">
					忘记密码？</view> -->
				<view hover-class="tui-opcity" :hover-stay-time="150" style="margin-top: 12rpx;">
					没有账号？
					<text class="tui-color-primary" @tap="toRegister">注册</text>
				</view>
			</view>
			<!-- 			<view class="agreement">
				<uni-agreements @setAgree="agree = $event" style="font-size: 24rpx;color: $uni-text-color-grey;"></uni-agreements>
			</view> -->
			<view class="tui-btn-box">
				<tui-button :disabledGray="true" :disabled="!canLogin" :shadow="true" shape="circle" @click="pwdLogin">
					登录</tui-button>
			</view>
		</view>
		<!-- <view class="tui-login-way" v-if="!popupShow"><view hover-class="tui-opcity" :hover-stay-time="150" @tap="showOtherLogin">其他方式登录</view></view> -->
		<tui-bottom-popup :mask="false" backgroundColor="transparent" :show="false">
			<view class="tui-auth-login">
				<!-- #ifndef MP -->
				<view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150">
					<image src="/static/images/share/icon_qq.png" class="tui-login-logo"></image>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
				<view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150">
					<image src="/static/images/share/icon_wechat.png" class="tui-login-logo"></image>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP -->
				<view class="tui-icon-platform" hover-class="tui-opcity" hover-stay-time="150">
					<image src="/static/images/share/icon_sina.png" class="tui-login-logo"></image>
				</view>
				<!-- #endif -->
			</view>
		</tui-bottom-popup>



		<!-- 
				<view class="content">
			<text class="title">{{$t('pwdLogin.pwdLogin')}}</text>
			<input class="input-box" :inputBorder="false" v-model="username" :placeholder="$t('pwdLogin.placeholder')"/>
			<input type="password" class="input-box" :inputBorder="false" v-model="password" :placeholder="$t('pwdLogin.passwordPlaceholder')"/>
			<view class="captcha-box" v-if="captchaBase64">
				<image class="captcha-img" @click="createCaptcha" :src="captchaBase64" mode="widthFix"></image>
				<input type="text" class="input-box captcha" :inputBorder="false" v-model="captcha" :placeholder="$t('pwdLogin.verifyCodePlaceholder')"/>
			</view>
			<uni-agreements @setAgree="agree = $event"></uni-agreements>
			<button class="send-btn" :disabled="!canLogin" :type="canLogin?'primary':'default'"
				@click="pwdLogin">{{$t('pwdLogin.login')}}</button>
			<view class="auth-box">
				<text class="link" @click="toRetrievePwd">{{$t('pwdLogin.forgetPassword')}}</text>
				<text class="link" @click="toRegister">{{$t('pwdLogin.register')}}</text>
			</view> -->
		<uni-quick-login :agree="agree" ref="uniQuickLogin"></uni-quick-login>
	</view>
	</view>

</template>

<script>
	import mixin from '../common/login-page.mixin.js';
	export default {
		mixins: [mixin],
		data() {
			return {
				"password": "",
				"username": "",
				"agree": true,
				"captchaBase64": "",
				"captcha": "",
				systemInfo: {}
			}
		},
		computed: {
			canLogin() {
				return this.username.length && this.isPwd;
			},
			isPwd() {
				return /^.{6,20}$/.test(this.password);
			},
			isPhone() {
				return /^1\d{10}$/.test(this.phone);
			},
		},
		onLoad() {
			this.systemInfo = uni.getSystemInfoSync()
		},
		methods: {
			clearInput: function(e) {
				switch (e) {
					case 1:
						this.username = "";
						break;
					case 2:
						this.password = "";
						break;
					case 3:
						this.captcha = ""
				}
			},
			back: function() {
				uni.navigateBack({

				})
			},
			// 页面跳转，找回密码
			toRetrievePwd() {
				uni.navigateTo({
					url: '../pwd-retrieve/pwd-retrieve?phoneNumber=' + (this.isPhone ? this.username : '') +
						'&phoneArea=' + this.currenPhoneArea
				})
			},
			/**
			 * 密码登录
			 */
			pwdLogin() {
				if (!this.agree) {
					return uni.showToast({
						title: this.$t('common').noAgree,
						icon: 'none'
					});
				}
				uni.showLoading({
					title: "正在登陆",
					mask: true
				})
				// 下边是可以登录
				uniCloud.callFunction({
					name: 'uni-id-cf',
					data: {
						action: 'login',
						params: {
							"username": this.username,
							"password": this.password,
							"captcha": this.captcha
						},
					},
					success: ({
						result
					}) => {
						console.log(result);
						if (result.code === 0) {
							// uni.setStorageSync("login_data",{username:this.username,password:this.password});
							this.loginSuccess(result)
						} else {
							if (result.needCaptcha) {
								uni.showToast({
									title: result.msg || '完成',
									icon: 'none'
								});
								this.createCaptcha()
							} else {
								uni.showModal({
									title: this.$t('common').error,
									content: result.msg,
									showCancel: false,
									confirmText: this.$t('common').gotIt
								});
							}
							uni.hideLoading()
						}
					}
				})
			},
			createCaptcha() {
				uniCloud.callFunction({
					name: 'uni-id-cf',
					data: {
						action: 'createCaptcha',
						params: {
							scene: "login"
						},
					},
					success: ({
						result
					}) => {
						if (result.code === 0) {
							this.captchaBase64 = result.captchaBase64
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
					}
				})
			},
			/* 前往注册 */
			toRegister(e) {
				console.log(e);
				uni.navigateTo({
					url: '/pages/ucenter/login-page/register/register'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// @import url("../common/login-page.css");
	@import '/common/app.css';
	/* #ifndef APP-NVUE */
	@import '/components/uni/uParse/src/wxParse.css';

	/* #endif */

	.container {
		/* #ifdef MP */
		padding-top: 44px;
		/* #endif */
		width: 750rpx;
		overflow: hidden;

		.tui-header {
			width: 100%;
			padding: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
		}

		.tui-page-title {
			width: 100%;
			font-size: 48rpx;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 42rpx;
			padding: 40rpx;
			box-sizing: border-box;
		}

		.tui-form {
			padding-top: 50rpx;

			.tui-view-input {
				width: 100%;
				box-sizing: border-box;
				padding: 0 40rpx;

				.tui-cell-input {
					width: 100%;
					display: flex;
					align-items: center;
					padding-top: 48rpx;
					padding-bottom: $uni-spacing-col-base;

					input {
						flex: 1;
						padding-left: $uni-spacing-row-base;
					}

					.tui-icon-close {
						margin-left: auto;
					}
				}
			}

			.tui-cell-text {
				width: 100%;
				padding: $uni-spacing-col-lg $uni-spacing-row-lg;
				box-sizing: border-box;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-left: 24rpx;

				.tui-color-primary {
					color: $uni-color-primary;
				}
			}

			.tui-btn-box {
				width: 100%;
				padding: 0 $uni-spacing-row-lg;
				box-sizing: border-box;
				margin-top: 80rpx;
			}
		}

		.tui-login-way {
			width: 100%;
			font-size: 26rpx;
			color: $uni-color-primary;
			display: flex;
			justify-content: center;
			position: fixed;
			left: 0;
			bottom: 80rpx;

			view {
				padding: 12rpx 0;
			}
		}

		.tui-auth-login {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-bottom: 80rpx;
			padding-top: 20rpx;

			.tui-icon-platform {
				width: 90rpx;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				margin-left: 40rpx;

				&::after {
					content: '';
					position: absolute;
					width: 200%;
					height: 200%;
					transform-origin: 0 0;
					transform: scale(0.5, 0.5) translateZ(0);
					box-sizing: border-box;
					left: 0;
					top: 0;
					border-radius: 180rpx;
					border: 1rpx solid $uni-text-color-placeholder;
				}
			}

			.tui-login-logo {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}

	.agreement {
		padding: 0 24rpx;
		font-size: 24rpx !important;
	}

	// .auth-box {
	// 	flex-direction: row;
	// 	justify-content: space-between;
	// 	margin-top: 20px;
	// }

	// .auth-box .link {
	// 	font-size: 26rpx;
	// }

	// .login-text-sub {
	// 	color: #8a8f8b;
	// }

	// .toRegister {
	// 	margin-top: 80px;
	// 	width: 600rpx;
	// }
	.captcha-box {
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		background-color: transparent;
	}

	.captcha-img {
		margin: 0 0 10px 24px;
		width: 220rpx;
	}

	.captcha {}
</style>
