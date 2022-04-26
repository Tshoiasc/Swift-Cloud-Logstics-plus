<template>
	<page-meta background-color="#f7f7f7" page-style="background-color:#f7f7f7" style="background-color: #f7f7f7;">
	</page-meta>
	<view class="center" style="background-color: #f7f7f7;">
		<tui-navigation-bar id="bar" @init="initNavigation" @change="opacityChange" :scrollTop="scrollTop"
			:title="userInfo?userInfo.nickname||userInfo.username||userInfo.mobile:'我'" backgroundColor="#fff"
			color="#fff" isFixed :isOpacity="true">
			<view class="navbar" :style="'top:'+ barParam.top+'px'" v-if="opacity > 0.65">
				<cloud-image class="navbar__avatar" width="64rpx" height="64rpx" mode="scaleToFill"
					style="border-radius: 50%;" v-if="userInfo.avatar_file&&userInfo.avatar_file.url"
					:src="userInfo.avatar_file.url"></cloud-image>
				<view class="navbar__name">
					{{userInfo.nickname||userInfo.username||userInfo.mobile}}
				</view>
			</view>
		</tui-navigation-bar>
		<uni-sign-in ref="signIn"></uni-sign-in>
		<view class="userInfo" @click.capture="toUserInfo">
			<cloud-image class="logo-img" width="124rpx" height="124rpx" mode="scaleToFill"
				v-if="userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"></cloud-image>
			<image v-else class="logo-img" src="https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/user/%E4%BA%91%EF%BC%8C%E5%A4%A9%E6%B0%94.png?sign=275fdba71bbda06d854daca9ca180e28&t=1650615747" mode="aspectFit"></image>
			<view class="logo-title">
				<text class="uer-name" v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
				<text class="uer-name" v-else>{{$t('mine.notLogged')}}</text>
			</view>
			<view class="edit_button">
				点击设置
			</view>
			<view class="ball-box">
				<view class="ball">
				</view>
			</view>

		</view>
		<view class="vipcard" style="position: relative;">
			<view class="title">
				大众会员
			</view>
			<view class="content">
				<view class="big">
					60
				</view>
				<view>
					/120 积分
				</view>
			</view>
<!-- 			<view class="img" style="position: absolute;right: 36rpx;top:0;bottom: 0;">
				<image src="https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/user/%E9%93%9C%E7%89%8C%EF%BC%8C%E5%A5%96%E7%89%8C%EF%BC%8C%E8%B5%A2%E5%AE%B6.png?sign=d81d937a2493c4c1cef7752f0f2611a8&t=1650614343" style="height: 104rpx;" mode="heightFix"></image>
			</view> -->
		</view>
		<view class="card">
			<view class="title-box">
				<view class="title">
					我的权益
				</view>
				<view class="href">
					查看全部
					<tui-icon name="arrowright" size="16" color="#999" />
				</view>
			</view>
			<view class="content">
				<view class="item" v-for="(item,i) in permission">
					<image :src="'https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/iconma_my/'+item.img"
						mode="heightFix" style="height: 84rpx;">
					</image>
					<view class="title">
						{{item.title}}
					</view>
					<view class="sub_title"
						style="display: flex;align-items: center;flex-direction: row;justify-content: center;">
						<text v-for="text in item.sub_title"
							:style="text.type == 'high' ? 'color:red;font-weight:500;':''">{{text.text}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="card card-sm">
			<view class="title-box">
				<view class="title">
					其他功能
				</view>
				<view class="href">
					查看全部
					<tui-icon name="arrowright" size="16" color="#999" />
				</view>
			</view>
			<view class="content">
				<view class="item" v-for="(item,i) in settings">
					<image :src="'https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/iconma_my/'+item.img"
						mode="heightFix" style="height: 64rpx;">
					</image>
					<view class="title">
						{{item.title}}
					</view>

				</view>
			</view>
		</view>
		<!-- 		<uni-list class="center-list" v-for="(sublist , index) in ucenterList" :key="index">
			<uni-list-item v-for="(item,i) in sublist" :title="item.title" link :rightText="item.rightText" :key="i"
				:clickable="true" :to="item.to" @click="ucenterListClick(item)" :show-extra-icon="true"
				:extraIcon="{type:item.icon,color:'#999'}">
				<template v-slot:footer>
					<view v-if="item.showBadge" class="item-footer">
						<text class="item-footer-text">{{item.rightText}}</text>
						<view class="item-footer-badge"></view>
					</view>
				</template>
			</uni-list-item>
		</uni-list> -->
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
	// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare()
	// #endif
	const db = uniCloud.database();
	export default {
		// #ifdef APP
		onBackPress({
			from
		}) {
			if (from == 'backbutton') {
				this.$nextTick(function() {
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		// #endif
		data() {
			return {
				permission: [{
						title: "公益捐赠",
						img: "a-savediscountzhekoujiesheng.png",
						sub_title: [{
								text: "每一单",
								type: "normal"
							},
							{
								text: "捐赠",
								type: "high"
							},
							{
								text: "一元",
								type: "normal"
							}
						]
					},
					{
						title: "精美包装",
						img: "shopping%EF%BC%8C%E8%B4%AD%E7%89%A9%EF%BC%8C%E8%B4%AD%E7%89%A9%E8%A2%8B.png",
						"sub_title": [{
								text: "贵重品",
								type: "normal"
							},
							{
								text: "精美",
								type: "high"
							},
							{
								text: "包装",
								type: "normal"
							}
						]
					},
					{
						title: "保险运输",
						img: "a-lockfastbaoxianxiang.png",
						sub_title: [{
								text: "更高",
								type: "high"
							},
							{
								text: "保价",
								type: "normal"
							},
							{
								text: "服务",
								type: "normal"
							}
						]
					},
					{
						title: "更加省钱",
						img: "a-zijinqiandai.png",
						"sub_title": [{
								text: "更低",
								type: "high"
							},
							{
								text: "快递价格",
								type: "normal"
							}
						]
					},
					{
						title: "多件优惠",
						img: "a-bagdaizi.png",
						"sub_title": [{
								text: "多件",
								type: "high"
							},
							{
								text: "大额优惠",
								type: "normal"
							}
						]
					},
					{
						title: "大件优惠",
						img: "a-huowuzhixiang.png",
						"sub_title": [{
								text: "大件",
								type: "high"
							},
							{
								text: "大额优惠",
								type: "normal"
							}
						]
					}
				],
				settings: [{
						title: "联系客服",
						img: "mail 2.png",
						sub_title: [{
								text: "每一单",
								type: "normal"
							},
							{
								text: "捐赠",
								type: "high"
							},
							{
								text: "一元",
								type: "normal"
							}
						]
					},
					{
						title: "关于我们",
						img: "通用图标2.png",
						"sub_title": [{
								text: "贵重品",
								type: "normal"
							},
							{
								text: "精美",
								type: "high"
							},
							{
								text: "包装",
								type: "normal"
							}
						]
					},
					{
						title: "隐私政策",
						img: "Identity 2.png",
						sub_title: [{
								text: "更高",
								type: "high"
							},
							{
								text: "保价",
								type: "normal"
							},
							{
								text: "服务",
								type: "normal"
							}
						]
					},
					{
						title: "更多设置",
						img: "switch 2.png",
						"sub_title": [{
								text: "更低",
								type: "high"
							},
							{
								text: "快递价格",
								type: "normal"
							}
						]
					}
				],
				opacity: 0,
				gridList: [{
						"text": "订单",
						"icon": "order",
						size: 28
					},
					{
						"text": "地址",
						"icon": "addressbook",
						size: 28
					},
					{
						"text": "分享",
						"icon": "share",
						size: 28
					}
				],
				ucenterList: [
					[{
							"title": this.$t('mine.signIn'),
							"event": 'signIn',
							"icon": "compose"
						},
						// #ifdef APP-PLUS
						{
							"title": this.$t('mine.toEvaluate'),
							"event": 'gotoMarket',
							"icon": "hand-thumbsup"
						},
						//#endif
						{
							"title": this.$t('mine.readArticles'),
							"to": '/pages/ucenter/read-news-log/read-news-log',
							"icon": "flag"
						},
						{
							"title": this.$t('mine.myScore'),
							"to": '',
							"event": 'getScore',
							"icon": "paperplane"
						}
						// #ifdef APP-PLUS
						, {
							"title": this.$t('mine.invite'),
							"event": 'share',
							"icon": "redo"
						}
						// #endif
					],
					[{
						"title": this.$t('mine.feedback'),
						"to": '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
						"icon": "help"
					}, {
						"title": this.$t('mine.settings'),
						"to": '/pages/ucenter/settings/settings',
						"icon": "gear"
					}],
					[{
						"title": this.$t('mine.about'),
						"to": '/pages/ucenter/about/about',
						"icon": "info"
					}]
				],
				scrollTop: 0,
				top: 0,
				barParam: {},
				listStyles: {
					"height": "150rpx", // 边框高度
					"width": "150rpx", // 边框宽度
					"border": { // 如果为 Boolean 值，可以控制边框显示与否
						"color": "#eee", // 边框颜色
						"width": "1px", // 边框宽度
						"style": "solid", // 边框样式
						"radius": "100%" // 边框圆角，支持百分比
					}
				},
				theme: "dark"
			}
		},
		onShow() {
			// #ifdef APP-PLUS
			plus.navigator.setStatusBarStyle(this.theme)
			// #endif
		},
		onLoad() {
			// console.log(313,this.userInfo,this.hasLogin);
			//#ifdef APP-PLUS
			this.ucenterList[this.ucenterList.length - 2].unshift({
				title: this.$t('mine.checkUpdate'), // this.this.$t('mine.checkUpdate')"检查更新"
				rightText: this.appVersion.version + '-' + this.appVersion.versionCode,
				event: 'checkVersion',
				icon: 'loop',
				showBadge: this.appVersion.hasNew
			})
			plus.navigator.setStatusBarStyle("dark")
			//#endif
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
			// #ifdef APP-PLUS
			,
			appVersion() {
				return getApp().appVersion
			}
			// #endif
			,
			appConfig() {
				return getApp().globalData.config
			}
		},
		methods: {
			...mapMutations({
				setUserInfo: 'user/login'
			}),
			initNavigation(e) {
				console.log(e)
				this.barParam = e
				// this.opacity = e.opacity;
				// this.top = e.top;

				// this.topContainerTop = e.height
				// this.height = e.height - e.statusBarHeight
			},
			opacityChange(e) {
				this.opacity = e.opacity;
			},
			toSettings() {
				uni.navigateTo({
					url: "/pages/ucenter/settings/settings"
				})
			},
			signIn() { //普通签到
				this.$refs.signIn.open()
			},
			/**
			 * 个人中心项目列表点击事件
			 */
			ucenterListClick(item) {
				if (!item.to && item.event) {
					this[item.event]();
				}
			},
			async checkVersion() {
				let res = await callCheckVersion()
				console.log(res);
				if (res.result.code > 0) {
					checkUpdate()
				} else {
					uni.showToast({
						title: res.result.message,
						icon: 'none'
					});
				}
			},
			toUserInfo() {
				uni.navigateTo({
					url: '/pages/ucenter/settings/settings'
				})
			},
			tapGrid(index) {
				uni.showToast({
					// title: '你点击了，第' + (index + 1) + '个',
					title: this.$t('mine.clicked') + " " + (index + 1),
					icon: 'none'
				});
			},
			/**
			 * 去应用市场评分
			 */
			gotoMarket() {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "ios") {
					// 这里填写appstore应用id
					let appstoreid = this.appConfig.marketId.ios; // 'id1417078253';
					plus.runtime.openURL("itms-apps://" + 'itunes.apple.com/cn/app/wechat/' + appstoreid + '?mt=8');
				}
				if (uni.getSystemInfoSync().platform == "android") {
					var Uri = plus.android.importClass("android.net.Uri");
					var uri = Uri.parse("market://details?id=" + this.appConfig.marketId.android);
					var Intent = plus.android.importClass('android.content.Intent');
					var intent = new Intent(Intent.ACTION_VIEW, uri);
					var main = plus.android.runtimeMainActivity();
					main.startActivity(intent);
				}
				// #endif
			},
			/**
			 * 获取积分信息
			 */
			getScore() {
				if (!this.userInfo) return uni.showToast({
					title: this.$t('mine.checkScore'),
					icon: 'none'
				});
				uni.showLoading({
					mask: true
				})
				db.collection("uni-id-scores")
					.where('"user_id" == $env.uid')
					.field('score,balance')
					.orderBy("create_date", "desc")
					.limit(1)
					.get()
					.then((res) => {
						console.log(res);
						const data = res.result.data[0];
						let msg = '';
						msg = data ? (this.$t('mine.currentScore') + data.balance) : this.$t('mine.noScore');
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}).finally(() => {
						uni.hideLoading()
					})
			},
			async share() {
				let {
					result
				} = await uniCloud.callFunction({
					name: 'uni-id-cf',
					data: {
						action: 'getUserInviteCode'
					}
				})
				console.log(result);
				let myInviteCode = result.myInviteCode || result.userInfo.my_invite_code
				console.log(myInviteCode);
				let {
					appName,
					logo,
					company,
					slogan
				} = this.appConfig.about
				// #ifdef APP-PLUS
				uniShare.show({
					content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
						type: 0,
						href: this.appConfig.h5.url +
							`/#/pages/ucenter/invite/invite?code=uniInvitationCode:${myInviteCode}`,
						title: appName,
						summary: slogan,
						imageUrl: logo +
							'?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
					},
					menus: [{
							"img": "/static/app-plus/sharemenu/wechatfriend.png",
							"text": this.$t('common').wechatFriends,
							"share": {
								"provider": "weixin",
								"scene": "WXSceneSession"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/wechatmoments.png",
							"text": this.$t('common').wechatBbs,
							"share": {
								"provider": "weixin",
								"scene": "WXSceneTimeline"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/weibo.png",
							"text": this.$t('common').weibo,
							"share": {
								"provider": "sinaweibo"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/qq.png",
							"text": "QQ",
							"share": {
								"provider": "qq"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/copyurl.png",
							"text": this.$t('common').copy,
							"share": "copyurl"
						},
						{
							"img": "/static/app-plus/sharemenu/more.png",
							"text": this.$t('common').more,
							"share": "shareSystem"
						}
					],
					cancelText: this.$t('common').cancelShare,
				}, e => { //callback
					console.log(e);
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f7f7;
	}

	.container {
		background-color: #f7f7f7;
	}

	.center {
		// overflow: hidden;
	}

	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	/* #endif*/
	.navbar {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: absolute;
	}

	.navbar__avatar {
		border-radius: 50%;
		overflow: hidden;
		margin: 0 12rpx 0 24rpx;
	}

	.navbar__name {
		font-size: 28rpx;
		color: #333;
	}

	.edit_button {
		position: absolute;
		right: 0;
		border-radius: 28rpx 0 0 28rpx;
		font-size: 25rpx;
		font-weight: 500;
		color: #fff;
		padding: 10rpx 32rpx 10rpx 24rpx;
		background-color: #f8c75b;
	}

	.userInfo {
		padding: 36rpx 24rpx;
		/* #ifdef MP */
		background-image: linear-gradient(to bottom, #fbe9d0, #fbe9d000);
		padding-top: 94px;
		padding-bottom: 54px;
		/* #endif */

		/* #ifndef MP */
		padding-top: 50px;
		padding-bottom: 54px;
		background-image: linear-gradient(to bottom, #fbe9d0, #fbe9d000);
		// background-image: url(../../static/images/other/head_bg-r.png);
		/* #endif */
		background-size: 100% 100%;
		// box-sizing: padding-box;
		align-items: center;
		display: flex;
		flex-direction: row;
		overflow: hidden;

	}

	.ball-box {
		content: '';
		width: 172rpx;
		height: 172rpx;
		position: absolute;

		right: 0rpx;
		top: 0rpx;
		overflow: hidden;

	}

	.ball {
		background-color: red;
		opacity: .1;
		filter: blur(8px);
		width: 172rpx;
		height: 172rpx;
		border-radius: 50%;
		margin-top: -32rpx;
		margin-right: -32rpx;
		margin-left: auto;
	}

	.logo-img {
		width: 124rpx;
		height: 124rpx;
		border-radius: 50%;
		backdrop-filter: blur(5px);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo-img image {
		border-radius: 50%;
	}

	.logo-title {
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 24rpx;
		/* font-size:36rpx !important; */
		font-weight: 500;
	}

	.uer-name {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 36rpx;
		color: #333;
	}

	.center-list {
		margin-bottom: 30rpx;
		background-color: #fff;
	}

	.center-list-cell {
		width: 750rpx;
		background-color: #007AFF;
		height: 40rpx;
	}

	.grid {
		background-color: #FFFFFF;
		// margin-bottom: 6px;
	}

	.uni-grid .text {
		font-size: 30rpx;
		height: 25px;
		line-height: 25px;
		color: #817f82;
	}

	.uni-grid .item ::v-deep .uni-grid-item__box {
		justify-content: center;
		align-items: center;
	}


	/*修改边线粗细示例*/
	/* #ifndef APP-NVUE */
	.center-list ::v-deep .uni-list--border:after {
		-webkit-transform: scaleY(0.2);
		transform: scaleY(0.2);
		margin-left: 80rpx;
	}

	.center-list ::v-deep .uni-list--border-top,
	.center-list ::v-deep .uni-list--border-bottom {
		display: none;
	}

	/* #endif */
	.item-footer {
		flex-direction: row;
		align-items: center;
	}

	.item-footer-text {
		color: #999;
		font-size: 24rpx;
		padding-right: 10rpx;
	}

	.item-footer-badge {
		width: 20rpx;
		height: 20rpx;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 10rpx;
		/* #endif */
		background-color: #DD524D;
	}

	.vipcard {
		margin: -38rpx 24rpx 24rpx 24rpx;
		height: 164rpx;
		color: #fff;
		box-sizing: padding-box;
		display: flex;
		justify-content: center;
		padding: 0 52rpx;
		// background-color:#f89530;
		border-radius: 36rpx;
		background-image: url(https://636c-cloud1-0glyq4v2627b233d-1306502030.tcb.qcloud.la/background.png?sign=16fd7be20528ce8005dfed6ae4960116&t=1649764100);
		background-attachment: fixed;
		/* background-image: linear-gradient(to right, #ed5a12bb 32%, #eead76); */
		box-shadow: 4rpx 4rpx 8rpx #f9a93777;
	}

	.vipcard .title {
		font-size: 32rpx;
		font-weight: 600;
	}

	.vipcard .content {
		margin-top: 10rpx;
		display: flex;

		align-items: center;
		flex-direction: row;
		font-size: 28rpx;
		letter-spacing: 2rpx;
	}

	.vipcard .content .big {
		letter-spacing: unset;
		font-size: 36rpx;
		font-weight: 600;
		margin-right: 6rpx;
	}

	.card {
		background-color: #fff;
		margin: 12rpx 24rpx;
		// height: 320rpx;
		border-radius: 16rpx;
		overflow: hidden;
		padding: 16rpx 20rpx;

		.title-box {
			display: flex;
			align-items: center;
			flex-direction: row;
			color: #333;

			.title {
				font-size: 34rpx;
				font-weight: bold;
			}

			.href {
				margin: 0 0 0 auto;
				font-size: 24rpx;
				color: #999;
				display: flex;
				align-items: center;
				flex-direction: row;
			}

		}

		.content {
			margin-top: 12rpx;
			display: flex;
			flex-wrap: wrap;
			// justify-content: space-between;
			flex-direction: row;

			.item+.item {
				border-left: 1rpx solid #efefef33;
			}

			.item {

				width: 216rpx;
				height: 280rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.title {
					margin-top: 26rpx;
					font-size: 28rpx;
					color: #555;
					font-weight: bold;
				}

				.sub_title {
					font-size: 24rpx;
					color: #999;
					margin-top: 20rpx
				}
			}
		}

	}

	.card.card-sm {
		.item {

			width: 165rpx;
			height: 220rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.title {
				margin-top: 26rpx;
				font-size: 28rpx;
				color: #555;
				font-weight: bold;
			}
		}
	}
</style>
