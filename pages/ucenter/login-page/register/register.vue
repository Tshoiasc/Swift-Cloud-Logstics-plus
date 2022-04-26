<template>
	<view class="container">
		<view class="tui-page-title">注册</view>
		<uni-forms class="tui-form" ref="form" :value="formData" :rules="rules">
			<view class="tui-view-input">
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent" required>
					<view class="tui-cell-input">
						<tui-icon name="people" color="#6d7a87" :size="20"></tui-icon>
						<input v-model="formData.username" placeholder="请输入用户名" placeholder-class="tui-phcolor"
							type="text" maxlength="11" />

						<view class="tui-icon-close" v-show="formData.username" @tap="clearInput(1)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent" required>
					<view class="tui-cell-input">
						<tui-icon name="label" color="#6d7a87" :size="20"></tui-icon>
						<input v-model="formData.nickname" placeholder="请输入昵称" placeholder-class="tui-phcolor"
							type="text" maxlength="11" />
						<view class="tui-icon-close" v-show="formData.nickname" @tap="clearInput(2)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent" required>
					<view class="tui-cell-input">
						<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
						<input placeholder="请输入密码"  :password="true" placeholder-class="tui-phcolor" type="text" maxlength="40" 
							v-model="formData.password" />
							<view class="tui-icon-close" v-show="formData.password" @tap="clearInput(3)">
								<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
							</view>
<!-- 						<view class="tui-btn-send" :class="{ 'tui-gray': isSend }"
							:hover-class="isSend ? '' : 'tui-opcity'" :hover-stay-time="150">{{ btnSendText }}</view> -->
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent" required>
					<view class="tui-cell-input">
						<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
						<input placeholder="请重新输入密码" :password="true" placeholder-class="tui-phcolor" type="text"
							maxlength="40" v-model="formData.pwd2" />
						<view class="tui-icon-close" v-show="formData.pwd2" @tap="clearInput(4)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
			</view>
			<!-- <uni-agreements @setAgree="agree = $event"></uni-agreements> -->
			<view class="tui-btn-box">
				<tui-button :disabledGray="true" :shadow="true" shape="circle" @click="submit">注册
				</tui-button>
			</view>
			<view class="tui-cell-text">
				注册代表同意
				<view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="protocol">
					用户服务协议、隐私政策</view>
			</view>
		</uni-forms>




		<!-- 		<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit" err-show-type="undertext"  class="tui-view-input">
			<uni-forms-item name="username" class="tui-cell-input" required>
				<uni-easyinput :inputBorder="false" class="easyinput" :placeholder="$t('register.usernamePlaceholder')" v-model="formData.username" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="nickname" class="tui-cell-input">
				<uni-easyinput :inputBorder="false" class="easyinput" :placeholder="$t('register.nicknamePlaceholder')" v-model="formData.nickname" trim="both" style="width: 660rpx;" />
			</uni-forms-item>
			<uni-forms-item name="password" class="tui-cell-input" v-model="formData.password" required>
				<uni-easyinput :inputBorder="false" class="easyinput" :placeholder="$t('register.passwordDigitsPlaceholder')" type="password" v-model="formData.password" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="pwd2" class="tui-cell-input" v-model="formData.pwd2" required>
				<uni-easyinput :inputBorder="false" class="easyinput" :placeholder="$t('register.passwordAgain')" type="password" v-model="formData.pwd2" trim="both" />
			</uni-forms-item>
			<uni-agreements @setAgree="agree = $event"></uni-agreements>
			<button class="send-btn" type="primary" @click="submit">{{$t('register.registerAndLogin')}}</button>
		</uni-forms> -->
	</view>
</template>

<script>
	import rules from './validator.js';
	import mixin from '../common/login-page.mixin.js';
	export default {
		mixins: [mixin],
		data() {
			return {
				formData: {
					"username": "",
					"nickname": "",
					'password': '',
					'pwd2': ''
				},
				rules,
				agree: true
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('register.navigationBarTitle')
			})
		},
		methods: {
			async valicadate(form){
				//yhm
				if(!form.username){
					uni.showToast({
						title:"请填写用户名",
						icon:"none"
					})
				return false;
				}
				if(form.username.length < 6 || form.username.length>32){
					uni.showToast({
						title:"用户名最小6位，最长32位",
						icon:"none"
					})
					return false;
				}
				if(/^1\d{10}$/.test(form.username) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(form.username)){
					uni.showToast({
						title:"用户名不能是：手机号或邮箱",
						icon:"none"
					})
					return false;
				};
				//pwd
				if(!form.password){
					uni.showToast({
						title:"请填写密码",
						icon:"none"
					})
				return false;
				}
				if(form.password.length < 6 || form.password.length>20){
					uni.showToast({
						title:"密码最小6位，最长20位",
						icon:"none"
					})
					return false;
				}
				//pwd2
				if(form.pwd2 != form.password){
					uni.showToast({
						title:"两次密码输入不一致",
						icon:"none"
					})
					return false;
				}
				//nickname
				if(!form.nickname){
					uni.showToast({
						title:"请填写昵称",
						icon:"none"
					})
					return false;
				}
				return true;

				
			},
			clearInput(e) {
				switch(e){
					case 1:
					this.formData.username = "";
					break;
					case 2:
					this.formData.nickname = "";
					break;
					case 3:
					this.formData.password = "";
					break;
					case 4:
					this.formData.pwd2 = "";
					break;
				}
			},
			/**
			 * 触发表单提交
			 */
			submit() {
				if (!this.agree) {
					return uni.showToast({
						title: this.$t('common').noAgree,
						icon: 'none'
					});
				}
				// uni.showLoading({
				// 	mask: true
				// })
				// this.formData.validate()
				// this.submitForm(this.formData,()=>{uni.hideLoading()})
				this.valicadate(this.formData).then(res=>{
					if(res){
						uni.showLoading({
							title:"注册中，请稍后"
						})
						this.submitForm(this.formData,()=>{uni.hideLoading()})
					}
				})
				// 		this.submitForm(res)
				// 	}).catch((errors) => {
				// 		console.log(errors);
				// 	})
				// 	.finally(() => {
				// 		uni.hideLoading()
				// 	})
			},
			submitForm(params,hd) {
				uniCloud.callFunction({
					name: 'uni-id-cf',
					data: {
						action: 'register',
						params,
					},
					success: ({
						result
					}) => {
						console.log(result);
						if (result.code === 0) {
							this.loginSuccess(result)
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
						hd()
					}
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
		.tui-page-title {
			width: 100%;
			font-size: 48rpx;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 42rpx;
			padding: 110rpx 40rpx 40rpx 40rpx;
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

					.tui-btn-send {
						width: 156rpx;
						text-align: right;
						flex-shrink: 0;
						font-size: $uni-font-size-base;
						color: $uni-color-primary;
					}

					.tui-gray {
						color: $uni-text-color-placeholder;
					}
				}
			}

			.tui-cell-text {
				width: 100%;
				padding: 40rpx $uni-spacing-row-lg;
				box-sizing: border-box;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				display: flex;
				align-items: center;

				.tui-color-primary {
					color: $uni-color-primary;
					padding-left: $uni-spacing-row-sm;
				}
			}

			.tui-btn-box {
				width: 100%;
				padding: 0 $uni-spacing-row-lg;
				box-sizing: border-box;
				margin-top: 80rpx;
			}
		}
	}

	/* 	@import url("../common/login-page.css");
	.uni-container {
		padding: 15px;
	}
	.send-btn{
		margin-top: 5px;
	}
	.uni-container ::v-deep .uni-forms-item__label{
		width: 15px !important;
	} */
</style>
