<template>
	<view class="container">
		<tui-navigation-bar id="bar" @init="initNavigation" @change="opacityChange" :scrollTop="scrollTop" title="首页"
			backgroundColor="#feaf62" color="#fff" isFixed>
			<view class="tui-header"
				:style="{ paddingTop:barParam.statusBarHeight+'px' , height:(barParam.height)+'px'}">
				<view class="tui-category" hover-class="opcity" :hover-stay-time="150" @tap="classify">
					<image class="logo"
						src="https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/yj2.png?sign=ec3d921324c74f84293d5e108a0a3644&t=1649815688"
						mode="heightFix"></image>
				</view>



				<view class="tui-rolling-search" :style="{ marginRight:searchDis + 'px'}">

					<tui-icon name="search-2" :size="32" unit="rpx"></tui-icon>
					<swiper vertical autoplay circular interval="8000" class="tui-swiper">
						<swiper-item v-for="(item, index) in hotSearch" :key="index" class="tui-swiper-item"
							@tap="search">
							<view class="tui-hot-item">{{ item }}</view>
						</swiper-item>
					</swiper>
				</view>
			</view>

		</tui-navigation-bar>
		<!--header-->

		<!--header-->
		<view class="tui-header-banner" :style="{ paddingTop : barParam.height +'px'}">
			<!-- 			<view class="tui-hot-search">
				<view>热搜</view>
				<view class="tui-hot-tag" @tap="search">自热火锅</view>
				<view class="tui-hot-tag" @tap="search">华为手机</view>
				<view class="tui-hot-tag" @tap="search">有机酸奶</view>
				<view class="tui-hot-tag" @tap="search">苹果手机</view>
			</view> -->
			<view class="tui-banner-bg">
				<view class="tui-primary-bg tui-route-left"></view>
				<view class="tui-primary-bg tui-route-right"></view>
				<!--banner-->
				<view class="tui-banner-box">
					<swiper :indicator-dots="true" :autoplay="true" :interval="5000" :duration="150"
						class="tui-banner-swiper" :circular="true" indicator-color="rgba(255, 255, 255, 0.8)"
						indicator-active-color="#fff">
						<swiper-item v-for="(item, index) in banner" :key="index" @tap.stop="detail">
							<image :src="item" class="tui-slide-image" mode="scaleToFill" />
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<view class="tui-product-category">
			<view class="tui-category-item" v-for="(item, index) in category" :key="index" :data-key="item.name"
				@click="more(item)">
				<view class="tui-image-box"
					style="width: 100%; flex-grow:1;height:100%;display: flex;align-items: center;justify-content: center;">
					<image
						:src="'https://636c-cloud1-0glyq4v2627b233d-1306502030.tcb.qcloud.la/icon_express/'  + item.img"
						class="tui-category-img" mode="widthFix"></image>
				</view>

				<view class="tui-category-name">{{ item.name }}</view>
			</view>
		</view>
		<image mode="widthFix"
			src="https://636c-cloud1-0glyq4v2627b233d-1306502030.tcb.qcloud.la/%E8%B4%AD%E7%89%A9%E5%BF%AB%E9%80%92%E6%9C%8D%E5%8A%A1%E7%AD%BE%E6%94%B6.png?sign=260a6a217c033a10fde4d75a06bd5f5d&t=1649781289"
			class="tui-img__coupon" @tap="coupon">
		</image>
		<view class="tui-product-box">
			<!--秒杀-->
			<!-- 			<view class="tui-block__box ">
				<view class="tui-group-name">
					<view class="tui-seckill__box">
						<image src="https://thorui.cn/images/mall/img_home_seckill_3x.png" class="tui-seckill__img"
							mode="widthFix"></image>
						<view class="tui-countdown__box">
							<view class="tui-countdown__title">距结束</view>
							<view class="tui-flex__center">
								<tui-countdown :time="3800" backgroundColor="transparent" borderColor="transparent"
									color="#EB0909" colonColor="#EB0909"></tui-countdown>
							</view>
						</view>
					</view>
					<view class="tui-more__box" @tap="seckill(1)">
						<text>更多</text>
						<tui-icon name="arrowright" :size="36" unit="rpx" color="#999"></tui-icon>
					</view>
				</view>
				<scroll-view scroll-x>
					<view class="tui-goods__list">
						<view class="tui-goods__item" @tap="seckill(2)" v-for="(item, index) in 8" :key="index">
							<view class="tui-goods__imgbox">
								<image :src="`/static/images/mall/product/${index % 2 == 0 ? 4 : 2}.jpg`"
									mode="widthFix" class="tui-goods__img"></image>
							</view>
							<view class="tui-pri__box">
								<view class="tui-sale-pri">
									<view class="tui-size-sm">¥</view>
									<view>298</view>
									<view class="tui-size-sm">.50</view>
								</view>
							</view>
							<view class="tui-original__pri">¥399.00</view>
						</view>
					</view>
				</scroll-view>
			</view> -->
			<!--超值拼团-->
			<!-- 			<view class="tui-block__box tui-mtop__20">
				<view class="tui-group-name">
					<view>
						<text>超值拼团</text>
						<text class="tui-sub__desc tui-color__pink">拼着买更便宜</text>
					</view>
					<view class="tui-more__box" @tap="group(1)">
						<text>更多</text>
						<tui-icon name="arrowright" :size="36" unit="rpx" color="#999"></tui-icon>
					</view>
				</view>
				<scroll-view scroll-x>
					<view class="tui-goods__list">
						<view class="tui-goods__item" @tap="group(2)" v-for="(item, index) in 8" :key="index">
							<view class="tui-goods__imgbox">
								<image :src="`/static/images/product/${index % 2 == 0 ? 55 : 44}.jpg`" mode="widthFix"
									class="tui-goods__img"></image>
							</view>
							<view class="tui-pri__box">
								<view class="tui-sale-pri">
									<view class="tui-size-sm">¥</view>
									<view>298</view>
									<view class="tui-size-sm">.50</view>
								</view>
							</view>
							<view class="tui-original__pri">¥399.00</view>
						</view>
					</view>
				</scroll-view>
			</view> -->

			<!--排行榜-->
			<view class="tui-block__box tui-mtop__20">
				<view class="tui-group-name" @tap="more">
					<view>
						<text>常用功能</text>
						<text class="tui-sub__desc">大家都在用</text>
					</view>
					<view class="tui-more__box">
						<text>更多</text>
						<tui-icon name="arrowright" :size="36" unit="rpx" color="#999"></tui-icon>
					</view>
				</view>
				<view class="tui-new-box">
					<view class="tui-new-item" :class="[index != 0 && index != 1 ? 'tui-new-mtop' : '']"
						v-for="(item, index) in newProduct" :key="index" @tap="detail">
						<image :src="'/static/images/mall/new/' + (item.type == 1 ? 'new' : 'discount') + '.png'"
							class="tui-new-label" v-if="item.isLabel"></image>
						<view class="tui-title-box" style="z-index: 2;max-width: 150rpx;">
							<view class="tui-new-title">{{ item.name }}</view>
							<view class="tui-new-price">
								<text class="tui-new-present">{{ item.present }}</text>
								<text class="tui-new-original" v-if="item.original">{{ item.original }}</text>
							</view>
						</view>
						<image mode="heightFix" style="z-index: 0;"
							:src="'https://636c-cloud1-0glyq4v2627b233d-1306502030.tcb.qcloud.la/image_express/' + item.pic"
							class="tui-new-img"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="tui-product-box">
			<view class="tui-title__img">
				<image
					src="https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/img_home_update_3x.png?sign=fe085c091296bb901e1bb1d2d3840499&t=1649906621"
					mode="widthFix"></image>
			</view>
			<view class="tui-product-list">
				<view class="tui-product-container">
					<!-- 					<block v-for="(item, index) in productList" :key="index" v-if="(index + 1) % 2 != 0">
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail">
							<image :src="'/static/images/mall/product/' + item.img + '.jpg'" class="tui-pro-img"
								mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.name }}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{ item.sale }}</text>
										<text class="tui-factory-price">￥{{ item.factory }}</text>
									</view>
									<view class="tui-pro-pay">{{ item.payNum }}人付款</view>
								</view>
							</view>
						</view>
					</block> -->
				</view>
				<!-- 				<view class="tui-product-container">
					<block v-for="(item, index) in productList" :key="index" v-if="(index + 1) % 2 == 0">
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail">
							<image :src="'/static/images/mall/product/' + item.img + '.jpg'" class="tui-pro-img"
								mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.name }}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{ item.sale }}</text>
										<text class="tui-factory-price">￥{{ item.factory }}</text>
									</view>
									<view class="tui-pro-pay">{{ item.payNum }}人付款</view>
								</view>
							</view>
						</view>
					</block>
				</view> -->
			</view>
		</view>

		<!--加载loadding-->
		<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
		<!-- <tui-nomore v-if="!pullUpOn"></tui-nomore> -->
		<!--加载loadding-->
		<view class="tui-safearea-bottom"></view>
	</view>
</template>
<script>
	export default {
		data() {
			return {

				current: 0,
				tabbar: [{
						icon: 'home',
						text: '首页',
						size: 48
					},
					{
						icon: 'manage',
						text: '分类',
						size: 54
					},
					{
						icon: 'cart',
						text: '购物车',
						size: 48
					},
					{
						icon: 'people',
						text: '我的',
						size: 52
					}
				],
				searchDis: 0,
				hotSearch: ['批量寄送', '宠物寄送', '加急件寄送'],
				banner: [
					'https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/%E5%BF%AB%E9%80%92.png?sign=b6bc05d71f59268f3bb38b43e34c77ce&t=1649814883'
				],
				category: [{
						img: 'a-suyunjieyunkuaidiwuliu.png',
						name: '速运服务',
						url: "./userPages/submitOrder/submitOrder"
					},
					{
						img: 'zhuangmanhuowudexiaohuoche.png',
						name: '搬家服务'
					},
					{
						img: 'a-suyunkuaidiwuliu.png',
						name: '跨境寄送'
					},
					{
						img: 'huowubanyun.png',
						name: '大件寄送'
					},
					{
						img: 'a-waimaikuaidi.png',
						name: '同城跑腿'
					},
					{
						img: 'a-shippinghaiyunyunshuwuliuhuoyunhuochuan.png',
						name: '海运服务'
					},
					{
						img: 'a-huowushangpin.png',
						name: '批量寄送'
					},
					{
						img: 'a-kuaidisonghuojiaohuo.png',
						name: '专属服务'
					},
					{
						img: 'a-boxshangpinhuowuwuliubaozhuanghezi.png',
						name: '包装服务'
					},
					{
						img: 'a-kuaididisongsonghuojiaohuo.png',
						name: '合作洽谈'
					}
				],
				newProduct: [{
						name: '保密寄送',
						present: "￥500起",
						original: "承诺全额赔付",
						pic: '安全.png',
						type: 1,
						isLabel: true
					},
					{
						name: '宠物寄送',
						present: "￥800起",
						original: "须符合要求",
						pic: '狗，动物.png',
						type: 2,
						isLabel: false
					},
					{
						name: '贵重物寄送,易碎品寄送',
						present: "￥198起",
						original: "损坏包赔",
						pic: '安装，安装包，盒子，包裹，纸箱.png',
						type: 1,
						isLabel: false
					},
					{
						name: '挂号信寄送',
						present: "￥20起",
						original: "贵重文件优选",
						pic: '电脑，邮件.png',
						type: 1,
						isLabel: true
					},
					{
						name: '加急件/特急件专送服务',
						present: "￥198起",
						original: "专人对接",
						pic: '电脑优化.png',
						type: 1,
						isLabel: false
					},
					{
						name: '广告招租',
						present: "价格详聊",
						pic: '广告，宣传.png',
						type: 2,
						isLabel: true
					}
				],
				productList: [{
						img: 1,
						name: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）',
						sale: 599,
						factory: 899,
						payNum: 2342
					},
					{
						img: 2,
						name: '德国DMK进口牛奶  欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒',
						sale: 29,
						factory: 69,
						payNum: 999
					},
					{
						img: 3,
						name: '【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红',
						sale: 299,
						factory: 699,
						payNum: 666
					},
					{
						img: 4,
						name: '百雀羚套装女补水保湿护肤品',
						sale: 1599,
						factory: 2899,
						payNum: 236
					},
					{
						img: 5,
						name: '百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋',
						sale: 599,
						factory: 899,
						payNum: 2399
					},
					{
						img: 6,
						name: '短袖睡衣女夏季薄款休闲家居服短裤套装女可爱韩版清新学生两件套 短袖粉色长颈鹿 M码75-95斤',
						sale: 599,
						factory: 899,
						payNum: 2399
					},
					{
						img: 1,
						name: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜',
						sale: 599,
						factory: 899,
						payNum: 2342
					},
					{
						img: 2,
						name: '德国DMK进口牛奶',
						sale: 29,
						factory: 69,
						payNum: 999
					},
					{
						img: 3,
						name: '【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红',
						sale: 299,
						factory: 699,
						payNum: 666
					},
					{
						img: 4,
						name: '百雀羚套装女补水保湿护肤品',
						sale: 1599,
						factory: 2899,
						payNum: 236
					}
				],
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				opacity: 1,
				top: 0,
				scrollTop: 0,
				opacity: 0,
				barParam: {}
			};
		},
		onLoad() {
			// #ifdef MP
			// let button_dis = wx.getMenuButtonBoundingClientRect();
			let button_dis = uni.getMenuButtonBoundingClientRect()
			this.searchDis = button_dis.width
			// #endif
		},
		methods: {
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
			tabbarSwitch: function(e) {

				let index = e.currentTarget.dataset.index;
				// this.current = index;
				if (index != 0) {
					if (index == 1) {
						this.classify();
					} else if (index == 2) {
						uni.navigateTo({
							url: '../shopcart/shopcart'
						});
					} else {
						uni.navigateTo({
							url: '../my/my'
						});
					}
				}
			},
			detail: function() {
				uni.navigateTo({
					url: '../productDetail/productDetail'
				});
			},
			coupon() {
				uni.navigateTo({
					url: '../coupon/coupon'
				});
			},
			classify: function() {
				uni.navigateTo({
					url: '../classify/classify'
				});
			},
			more: function(e) {
				let key = e.url;
				uni.navigateTo({
					url:  key
				});
			},
			search: function() {
				uni.navigateTo({
					url: '../../news/search/search'
				});
			},
			seckill(type) {
				let url = type == 1 ? '../seckillList/seckillList' : '../seckillDetail/seckillDetail';
				this.tui.href(url);
			},
			group(type) {
				let url = type == 1 ? '../groupList/groupList' : '../groupDetail/groupDetail';
				this.tui.href(url);
			}
		},
		onPullDownRefresh: function() {
			let loadData = JSON.parse(JSON.stringify(this.productList));
			loadData = loadData.splice(0, 10);
			this.productList = loadData;
			this.pageIndex = 1;
			this.pullUpOn = true;
			this.loadding = false;
			uni.stopPullDownRefresh();
		},
		onReachBottom: function() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			if (this.pageIndex == 4) {
				this.loadding = false;
				this.pullUpOn = false;
			} else {
				let loadData = JSON.parse(JSON.stringify(this.productList));
				loadData = loadData.splice(0, 10);
				if (this.pageIndex == 1) {
					loadData = loadData.reverse();
				}
				this.productList = this.productList.concat(loadData);
				this.pageIndex = this.pageIndex + 1;
				this.loadding = false;
			}
		},
		onPageScroll(e) {
			// #ifdef APP-PLUS
			let scrollTop = e.scrollTop;
			if (scrollTop < 0) {
				if (this.opacity > 0)
					this.opacity = 1 - Math.abs(scrollTop) / 30;
			} else {
				this.opacity = 1
			}
			// #endif
		}
	};
</script>

<style scoped>
	@import '/common/app.css';
	/* #ifndef APP-NVUE */
	@import '/components/uni/uParse/src/wxParse.css';

	/* #endif */
	page {
		background-color: #f7f7f7;
	}

	.container {
		padding-bottom: 100rpx;
		color: #333;
		background-color: #f7f7f7;
	}

	#bar {
		z-index: 1000;
	}

	.tui-header {
		height: 100rpx;

		padding: 0 30rpx 0 20rpx;
		box-sizing: border-box;
		background-color: #feaf62;
		display: flex;
		/* filter: blur(5px); */
		align-items: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 0;
		/* background:inherit; */
		-webkit-backdrop-filter: blur(5px);
		-moz-backdrop-filter: blur(5px);
		-o-backdrop-filter: blur(5px);
		backdrop-filter: blur(5px);
		backdrop-filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);
		/* transition: opacity .4s; */
	}

	.tui-header-bg {
		/* 
		position: absolute;
		top: 0;
		height: 44px; */
	}


	.tui-rolling-search {
		width: 100%;
		height: 60rpx;
		border-radius: 35rpx;
		padding: 0 40rpx 0 30rpx;
		box-sizing: border-box;
		background-color: #fff;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		color: #999;
	}

	.tui-category {
		position: relative;
		z-index: 999;
		height: 100%;
		font-size: 24rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 0;
		margin-right: 22rpx;
		flex-shrink: 0;
	}

	.tui-category-scale {
		transform: scale(0.7);
		line-height: 24rpx;
	}

	.tui-icon-category {
		/* line-height: 20px !important; */
		margin-bottom: 0 !important;
	}

	.tui-swiper {
		font-size: 26rpx;
		height: 60rpx;
		flex: 1;
		padding-left: 12rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.tui-swiper-item {
		display: flex;
		align-items: center;
	}

	.logo {
		height: 100%;
		opacity: .9;
	}

	.tui-hot-item {
		line-height: 26rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-header-banner {
		padding-top: 100rpx;
		box-sizing: border-box;
		background: #feaf62;
	}

	.tui-hot-search {
		color: #fff;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.tui-hot-tag {
		background-color: rgba(255, 255, 255, 0.15);
		padding: 10rpx 24rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 24rpx;
	}

	.tui-banner-bg {
		display: flex;
		height: 180rpx;
		background-color: #feaf62;
		position: relative;
	}

	.tui-primary-bg {
		width: 50%;
		display: inline-block;
		height: 224rpx;
		border: 1px solid transparent;
		position: relative;
		z-index: 1;
		background-color: #feaf62;
	}

	.tui-route-left {
		transform: skewY(8deg);
	}

	.tui-route-right {
		transform: skewY(-8deg);
	}

	.tui-banner-box {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: absolute;
		/* overflow: hidden; */
		z-index: 99;
		bottom: -80rpx;
		left: 0;
	}

	.tui-banner-swiper {
		width: 100%;
		height: 240rpx;
		border-radius: 20rpx;
		overflow: hidden;
		transform: translateY(0);
		background-color: #f8f8f8;
	}

	.tui-slide-image {
		width: 100%;
		height: 240rpx;
		display: block;
	}

	/* #ifdef MP-WEIXIN */
	.tui-banner-swiper .wx-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.tui-banner-swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	.tui-banner-swiper .wx-swiper-dot-active::before {
		background-color: #fff;
	}

	.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	/* #ifndef MP-WEIXIN */
	>>>.tui-banner-swiper .uni-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background-color: none;
		justify-content: space-between;
	}

	>>>.tui-banner-swiper .uni-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	>>>.tui-banner-swiper .uni-swiper-dot-active::before {
		background-color: #fff;
	}

	>>>.tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	.tui-product-category {
		padding: 80rpx 20rpx 30rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: #555;
		/* margin-bottom: 20rpx; */
	}

	.tui-category-item {
		width: 20%;
		height: 118rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-img-box {}


	.tui-category-img {
		width: 64rpx;
		align-items: center;
		display: flex;
		display: block;
	}

	.tui-category-name {
		line-height: 24rpx;
	}

	.tui-block__box {
		width: 100%;
		padding: 0 25rpx 25rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.tui-product-box {
		margin-top: 20rpx;
		padding: 0 25rpx;
		box-sizing: border-box;
	}

	.tui-img__coupon {
		width: 92%;
		border-radius: 16rpx;
		align-self: center;
		height: 184rpx;
		display: block;
	}

	.tui-mtop__20 {
		margin-top: 20rpx;
	}

	.tui-bg-white {
		background-color: #fff;
	}

	.tui-group-name {
		width: 100%;
		font-size: 34rpx;
		line-height: 34rpx;
		font-weight: bold;
		text-align: center;
		padding: 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333;
	}

	.tui-sub__desc {
		color: #71c796;
		font-size: 28rpx;
		font-weight: 400;
		padding-left: 25rpx;
	}

	.tui-color__pink {
		color: #EF1346;
	}

	.tui-seckill__box {
		display: flex;
		align-items: center;
	}

	.tui-seckill__img {
		width: 160rpx;
		height: 34rpx;
	}

	.tui-countdown__box {
		width: 228rpx;
		display: flex;
		align-items: center;

		color: #fff;
		background-color: #fff;
		font-weight: 400;
		border: 1rpx solid #eb0909;
		height: 40rpx;
		border-radius: 30px;
		overflow: hidden;
		margin-left: 25rpx;
	}

	.tui-countdown__title {
		width: 100rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #eb0909;
		flex-shrink: 0;
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-flex__center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/*秒杀商品*/
	.tui-goods__list {
		display: flex;
		align-items: center;
	}

	.tui-goods__item {
		background-color: #fff;
		width: 150rpx;
		height: 230rpx;
		border-radius: 6rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-shrink: 0;
		margin-right: 18rpx;
	}

	.tui-goods__imgbox {
		width: 150rpx;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.tui-goods__img {
		max-width: 150rpx;
		max-height: 150rpx;
		display: block;
	}

	.tui-pri__box {
		max-width: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tui-sale-pri {
		display: flex;
		align-items: flex-end;
		padding: 10rpx 0 8rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		line-height: 28rpx;
		color: #eb0909;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.tui-size-sm {
		font-size: 24rpx;
		line-height: 24rpx;
		transform: scale(0.8);
		transform-origin: 0 50%;
	}

	.tui-original__pri {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #999999;
		transform-origin: center 10%;
		transform: scale(0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: line-through;
	}

	/*秒杀商品*/

	.tui-more__box {
		display: flex;
		align-items: center;
		font-weight: 400;
		color: #999;
	}

	.tui-more__box text {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-new-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.tui-new-item {
		width: 49%;
		height: 180rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #f5f2f9;
		position: relative;
		border-radius: 12rpx;
	}

	.tui-new-mtop {
		margin-top: 2%;
	}

	.tui-title-box {
		font-size: 24rpx;
	}

	.tui-new-title {
		line-height: 32rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-new-price {
		padding-top: 4rpx;
		display: flex;
		flex-direction: column;
	}

	.tui-new-present {
		color: #ff201f;
		font-weight: bold;
		z-index: 999;
	}

	.tui-new-original {
		display: inline-block;
		color: #a0a0a0;
		font-size: 20rpx;
		padding-top: 4rpx;
		/* text-decoration: line-through; */
		/* padding-left: 12rpx; */
		/* transform: scale(0.8); */
		/* transform-origin: center center; */
		z-index: 999;
	}

	.tui-new-img {
		position: absolute;
		right: 0;
		z-index: 2;
		height: 148rpx;
		display: block;
		flex-shrink: 0;
		z-index: 0;
	}

	.tui-new-label {
		width: 56rpx;
		height: 56rpx;
		border-top-left-radius: 12rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 4;
	}

	.tui-title__img {
		width: 100%;
		padding: 30rpx 0;
		display: flex;
		justify-content: center;
	}

	.tui-title__img image {
		width: 352rpx;
		height: 32rpx;
	}

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		/* padding-top: 20rpx; */
	}

	.tui-product-container {
		flex: 1;
		margin-right: 2%;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 4%;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-pro-price {
		padding-top: 18rpx;
	}

	.tui-sale-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	}
</style>
