<template>
	<view>
		<view class="tui-addr-box">
			<form :report-submit="true">
				<tui-list-cell :hover="false" padding="0">
					<view class="tui-line-cell">
						<view class="tui-title">联系人</view>
						<input placeholder-class="tui-phcolor" class="tui-input" name="name" placeholder="请输入联系人姓名"
							maxlength="15" type="text" v-model="name" />
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" padding="0">
					<view class="tui-line-cell">
						<view class="tui-title">手机号码</view>
						<input placeholder-class="tui-phcolor" class="tui-input" name="mobile" placeholder="请输入联系人手机号码"
							maxlength="11" type="number" v-model="phone" />
					</view>
				</tui-list-cell>
				<tui-list-cell :arrow="true" padding="0">
					<view class="tui-line-cell" @click="onSelectCity">
						<view class="tui-title"><text class="tui-title-city-text">所在地区</text></view>
						<input placeholder-class="tui-phcolor" class="tui-input" disabled name="city"
							placeholder="请选择地区" maxlength="50" type="text" v-model="city.text" />
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" padding="0">
					<view class="tui-line-cell">
						<view class="tui-title">详细地址</view>
						<input placeholder-class="tui-phcolor" class="tui-input" name="address"
							placeholder="请输入详细的联系人地址" maxlength="50" type="text" v-model="real_address" />
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" padding="0">
					<view class="tui-line-cell">
						<view class="tui-cell-title">地址类型</view>
						<view class="tui-addr-label">
							<text v-for="(item,index) in lists" :key="index" class="tui-label-item"
								:class="{'tui-label-active':item==ad_type}" @click="onClickTag(item)">{{item}}</text>
						</view>
					</view>
				</tui-list-cell>

				<!-- 默认地址 -->
				<tui-list-cell :hover="false" padding="0">
					<view class="tui-swipe-cell">
						<view>设为默认地址</view>
						<switch checked color="#19be6b" class="tui-switch-small" @change="onChangeDefault" />
					</view>
				</tui-list-cell>
				<!-- 保存地址 -->
				<view class="tui-addr-save">
					<tui-button shadow type="primary" height="88rpx" shape="circle" @click="store">保存联系人</tui-button>
				</view>
				<view class="tui-del" v-if="edit">
					<tui-button shadow type="gray" height="88rpx" shape="circle" @click="del">删除联系人</tui-button>
				</view>
			</form>
		</view>
		<tui-bottom-popup :zIndex="1002" :maskZIndex="1001" :show="popupShow" @close="popup">
			<view class="tui-share">
				<view class="tui-share-title">请选择地址</view>
				<view class="tui-mt">
					<view style="padding: 0 24rpx;">
						<u-search :placeholder="'请输入关键词搜索'" v-model="keyword" shape="round" :showAction="false"
							@search="search">
						</u-search>
						<tui-cascade-selection backgroundColor="transparent" headerBgColor="transparent" height="320px"
							activeColor="#007AFF" lineColor="#007AFF" checkMarkColor="#007AFF" :itemList="itemList2"
							request :defaultItemList="defaultItemList" :receiveData="receiveData" @complete="complete2"
							@change="change" :reset="reset">
						</tui-cascade-selection>
					</view>
				</view>
				<view class="tui-btn-cancle" @tap="popup">完成</view>
			</view>
		</tui-bottom-popup>
		<tui-modal :show="modal" custom>
			<view class="tui-modal-custom" style="text-align: center;">
				<view class="tui-modal-custom-text">猜您要搜的</view>
				<scroll-view :scroll-y="true" style="height: 480rpx; background-color: white;margin-top: 24rpx;">
					<view v-for="(item,index) in searchList" :key="index" @click="onClickCity(item)"
						style="height: 56rpx;font-weight: bold;color: #333;font-size: 28rpx;border-bottom: 1rpx solid #eeeeee55;display: flex;align-items: center;justify-content: center;">
						{{item.data.fullname}}
					</view>
				</scroll-view>
				<tui-button height="64rpx" :size="28" type="primary" shape="square" @click="handleClick"
					style="margin-top: 24rpx;">没有我要的
				</tui-button>
			</view>
		</tui-modal>
	</view>
</template>
<script>
	import QQMapWX from '@/libs/qqmap-wx-jssdk.min.js';
	export default {
		data() {
			return {
				lists: ["公司", "家", "学校", "其他"],
				keyword: "",
				modal: false,
				webURL: 'https://thorui.cn',
				type: "add",
				shareList: [{
					share: [{
						name: "QQ",
						icon: "qq",
						color: "#07BDFD",
						size: 34
					}, {
						name: "微信",
						icon: "wechat",
						color: "#80D640"
					}, {
						name: "朋友圈",
						icon: "moments",
						color: "#80D640",
						size: 32
					}, {
						name: "支付宝",
						icon: "alipay",
						color: "#00AAEE"
					}, {
						name: "新浪微博",
						icon: "sina",
						color: "#F9C718"
					}, {
						name: "小程序",
						icon: "applets",
						color: "#2BA348"
					}, {
						name: "钉钉",
						icon: "dingtalk",
						color: "#2DA0F1"
					}, {
						name: "浏览器打开",
						icon: "explore-fill",
						color: "#1695F7"
					}, {
						name: "邮件",
						icon: "mail-fill",
						color: "#2868E5"
					}]
				}, {
					operate: [{
						name: "投诉",
						icon: "warning",
						size: 30
					}, {
						name: "复制链接",
						icon: "link",
						size: 28
					}, {
						name: "刷新",
						icon: "refresh",
						size: 30
					}, {
						name: "搜索内容",
						icon: "search-2",
						size: 28
					}]
				}],
				popupShow: false,
				cityList: [],
				qqmapsdk: {},
				receiveData: [],
				itemList2: [],
				key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
				all_data: [],
				reset: 0,
				defaultItemList: [],
				searchList: [],
				activeIndex: 1,
				edit: false,
				default: true,
				name: "",
				phone: "",
				city: {},
				real_address: "",
				ad_type: "家",
				storeIndex: 0,
				cls: "send"
			};
		},
		onLoad(e) {
			const _this = this
			this.qqmapsdk = new QQMapWX({
				key: this.key
			});
			const {
				type,
				cls,
				data
			} = e
			this.cls = cls
			console.log(type)
			if (type == 'edit') {
				this.edit = true
				let r_data = JSON.parse(data)
				console.log(r_data)
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: "联系人编辑"
				})
				this.storeIndex = r_data.storeIndex
				console.log(this.storeIndex)
				if (typeof(this.storeIndex) != 'number') {
					uni.showToast({
						title: "参数错误",
						icon: "none"
					})
					uni.navigateBack()
				}
				this.name = r_data.name;
				this.phone = r_data.phone;
				this.city = r_data.city;
				this.ad_type = r_data.ad_type;
				this.real_city = r_data.real_city;
				this.real_address = r_data.address
			} else if (type == 'add') {
				this.type = "add"
				//获取全国城市列表


			} else {
				uni.showModal({
					content: "系统错误",
					showCancel: false,
					success(e) {
						uni.reLaunch({
							url: "/pages/list/list"
						})
					}
				})
			}
			this.qqmapsdk.getCityList({
				success: function(res) {
					// console.log(res);
					_this.all_data = res.result
					_this.itemList2 = res.result[0].map(a => ({
						src: _this.webURL + '/images/basic/color.png',
						text: a.fullname,
						subText: a.pinyin.join(""),
						value: a
					}))
					console.log(_this.itemList2)

				},
				fail: function(res) {
					uni.showToast({
						title: "获取城市列表失败",
						icon: "none",
						success: (e) => {
							uni.navigateBack()
						}
					})
				},
				complete: function(res) {
					// console.log(res);
				}
			});
		},
		methods: {
			handleClick() {
				this.modal = false
			},
			search(e) {
				console.log(e, this.receiveData)
				let flag_data = this.searchKey(e)
				console.log(flag_data)
				if (flag_data.length) {
					if (flag_data.length == 1) {
						this.onSearch(flag_data[0])
					} else {
						this.searchList = flag_data
						this.modal = true
					}
				} else {
					uni.showToast({
						title: "没检索到该地区",
						icon: "none"
					})
				}
			},
			searchKey(e, real) {
				let flag_data = [];
				for (let i = 0; i < this.all_data.length; i++) {
					for (let j = 0; j < this.all_data[i].length; j++) {
						if (real) {
							if (this.all_data[i][j].fullname == e) {
								return ({
									i,
									j,
									data: this.all_data[i][j]
								})
							}
						} else {
							if (this.all_data[i][j].fullname.indexOf(e) != -1) {
								flag_data.push({
									i,
									j,
									data: this.all_data[i][j]
								})
							}
						}

					}
				}
				return flag_data
			},
			onSearch(flag_data) {
				const _this = this
				if (flag_data) {
					//巡回
					this.qqmapsdk.reverseGeocoder({
						location: {
							latitude: flag_data.data.location.lat,
							longitude: flag_data.data.location.lng
						},
						success: (e) => {
							console.log(e)
							if (e.status === 0) {
								_this.reset = Math.random()
								let result_comps = ["province", "city", "district", "street"]
								// _this.receiveData = []
								let result_data = []
								for (let index = 0, down_list = [], down_start_key = 0; index <= flag_data
									.i; index++) {
									let comp = result_comps[index]
									if (e.result.address_component[comp].length) {
										let temp_data = _this.searchKey(e.result.address_component[comp], true)
										console.log(temp_data)
										let current_list = down_list.length ? down_list : Object.assign([],
											_this.all_data[temp_data.i]).map(a => ({
											src: _this.webURL + '/images/basic/color.png',
											text: a.fullname,
											subText: a.pinyin ? a.pinyin.join("") : "",
											value: a
										}))
										console.log(temp_data)
										console.log(temp_data.data)
										if (temp_data.data.cidx) {
											down_list = Object.assign([], _this.all_data[temp_data.i + 1])
												.slice(
													temp_data.data
													.cidx[0], temp_data.data.cidx[1])
												.map(a => ({
													src: _this.webURL + '/images/basic/color.png',
													text: a.fullname,
													subText: a.pinyin ? a.pinyin.join("") : "",
													value: a
												}))
										}
										let need_data = {
											text: temp_data.data.fullname,
											subText: temp_data.data.pinyin ? temp_data.data.pinyin.join(
												"") : "",
											value: temp_data.data,
											src: _this.webURL + '/images/basic/color.png',
											index: temp_data.j - down_start_key,
											list: current_list
										}
										result_data.push(need_data)
										if (temp_data.data.cidx) {
											down_start_key = temp_data.data.cidx[0]
										}
									}
								}
								// console.log(result_data)
								_this.defaultItemList = result_data
								_this.change({
									layer: flag_data.i,
									subIndex: _this.defaultItemList[_this.defaultItemList.length - 1]
										.index,
									..._this.defaultItemList[_this.defaultItemList.length - 1]
								})

							}

						},
						fail: (e) => {
							console.log(e)
						}

					})
				} else {
					console.log("未搜索到结果")
					uni.showToast({
						title: "未搜索到结果",
						icon: "none"
					})
				}
			},
			onChangeDefault(e) {
				console.log(e)
				this.default = e.detail.value
			},
			onClickTag(item) {
				// this.activeIndex = index
				console.log(item)
				this.ad_type = item
			},
			async store() {
				let data = uni.getStorageSync("offen_address") || []
				let temp = {
					name: this.name,
					phone: this.phone,
					city: this.city,
					address: this.real_address,
					ad_type: this.ad_type,
					default: this.default,
					cls:this.cls
				}
				let search_area = await new Promise((resolve, reject) => {
					this.qqmapsdk.geocoder({
						address: temp.city.text + temp.address,
						success: (e) => {
							if (e.status == 0) {
								resolve(e.result)
							} else {
								resolve(null)
							}
						},
						fail: (e) => {
							resolve(null)
						}
					})
				})
				if (search_area) {
					temp.area = search_area
				} else {
					temp.area = temp.value
				}
				if (this.type == "edit") {
					data[this.storeIndex] = temp
				} else {
					data.push(temp)
				}

				uni.setStorageSync("offen_address", data)
				uni.navigateBack()
			},
			del() {
				let data = uni.getStorageSync("offen_address") || [{}]
				data.splice(this.storeIndex, 1)
				uni.setStorageSync("offen_address", data)
				uni.navigateBack()
			},
			onSelectCity() {
				this.popupShow = true
			},
			change(e) {
				console.log(e);
				const _this = this
				switch (e.layer) {
					case 0:

						break;
				}
				/**
				 *   layer: 0  第几级 index
					 src: '/static/images/basic/color.png'
					 subIndex: 2   //当前层级下选中项index
					 subText: '30人'  //选中项数据
					 text: '高一(3)班'
					 value: 103 //选中项value数据
				 * */

				// 模拟请求


				uni.showLoading({
					title: '请稍候...'
				});
				setTimeout(() => {
					uni.hideLoading();
					//请求完成后将数据处理成以下格式，传入，最后一级没有则传空数组
					this.qqmapsdk.getDistrictByCityId({
						id: e.value.id,
						success: (e) => {
							console.log(e)
							_this.receiveData = e.result[0].map(a => ({
								src: _this.webURL + '/images/basic/color.png',
								text: a.fullname,
								subText: a.pinyin ? a.pinyin.join("") : "",
								value: a
							}))
						},
						fail: (e) => {
							_this.receiveData = [];
						}
					})
				}, 200);
			},
			complete2(e) {
				console.log(e);
				// this.tui.toast('您选择的数据为：' + e.text);
				// console.log(e)

				this.city = e
			},
			onClickCity(e) {
				console.log(e)
				this.onSearch(e)
				this.modal = false
			},
			popup(e) {
				console.log(e)
				this.popupShow = false
			},
		}
	}
</script>

<style lang="scss">
	/* 隐藏scroll-view滚动条*/
	// ::-webkit-scrollbar {
	// 	width: 0;
	// 	height: 0;
	// 	color: transparent;
	// }

	/*header*/
	.tui-header {
		width: 100%;
		padding-top: 34rpx;
		/* box-shadow: 0 15rpx 10rpx -15rpx #f2f2f2; */
		box-sizing: border-box;
		background-color: #fff;
		position: fixed;
		z-index: 1000;
	}

	.tui-header-top,
	.tui-header-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		color: #333;
	}

	.tui-top-item {
		height: 26rpx;
		line-height: 26rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-topitem-active {
		position: relative;
		font-weight: bold;
	}

	.tui-topitem-active::after {
		content: '';
		position: absolute;
		width: 44rpx;
		height: 6rpx;
		background: #5677fc;
		border-radius: 6rpx;
		bottom: -10rpx;
		left: 50%;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
	}

	.tui-price-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 20rpx;
	}

	.tui-bottom-item .tui-icon-class,
	.tui-screen .tui-icon-class {
		margin-left: 6rpx;
	}

	.tui-icon-box {
		line-height: 12px !important;
		padding: 0 !important;
		display: block !important;
		position: relative;
	}

	.tui-arrow-up {
		top: 5px;
	}

	.tui-arrow-down {
		top: -3px;
	}

	.tui-header-bottom {
		margin-top: 56rpx;
		height: 108rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		align-items: flex-start;
		overflow: hidden;
	}

	.tui-bottom-text {
		line-height: 24rpx;
	}

	.tui-bottom-item {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 18rpx 12rpx;
		border-radius: 40rpx;
		box-sizing: border-box;
		background: #f2f2f2;
		margin-right: 20rpx;
		white-space: nowrap;
	}

	.tui-bottom-item:last-child {
		margin-right: 0;
	}

	.tui-btmItem-active {
		padding-bottom: 60rpx;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-active {
		color: #5677fc;
	}

	.tui-ml {
		margin-left: 6rpx;
	}

	.tui-seizeaseat-20 {
		height: 20rpx;
	}

	.tui-seizeaseat-30 {
		height: 30rpx;
	}

	.tui-middle {
		vertical-align: middle;
	}

	.tui-drop-item .tui-icon-class {
		vertical-align: middle;
	}

	/*header*/

	/*header 下拉选择*/

	.tui-scroll-box {
		width: 100%;
		height: 480rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 99;
		color: #fff;
		font-size: 30rpx;
		word-break: break-all;
	}

	.tui-drop-item {
		color: #333;
		height: 80rpx;
		font-size: 28rpx;
		padding: 20rpx 40rpx 20rpx 40rpx;
		box-sizing: border-box;
		display: inline-block;
		width: 50%;
	}

	.tui-drop-btnbox {
		width: 100%;
		height: 100rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		display: flex;
	}

	.tui-drop-btn {
		width: 50% !important;
		border-radius: 0 !important;
		font-size: 32rpx !important;
		text-align: center;
		height: 100rpx;
		line-height: 100rpx;
		border: 0;
	}


	/*header 下拉选择*/

	.top-dropdown {
		margin-top: 360rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
	}

	.tui-share-box {
		padding: 0 50rpx;
		box-sizing: border-box;
	}

	.tui-drop-input-box {
		padding: 50rpx;
		box-sizing: border-box;
	}

	.tui-animation {
		display: inline-block;
		transform: rotate(0deg);
		transition: all 0.2s;
	}

	.tui-animation-show {
		transform: rotate(180deg);
	}

	.tui-selected-list {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		transform: translateZ(0);
	}

	.tui-dropdown-scroll {
		height: 400rpx;
	}

	.tui-cell-class {
		display: flex;
		align-items: center;
		padding: 26rpx 30rpx !important;
	}

	.tui-ml-20 {
		margin-left: 20rpx;
	}

	.tui-share {
		background: #e8e8e8;
		position: relative;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-share-title {
		font-size: 28rpx;
		color: #7E7E7E;
		text-align: center;
		line-height: 26rpx;
		padding: 24rpx 0 8rpx 0;
	}

	.tui-share-top,
	.tui-share-bottom {
		min-width: 101%;
		padding: 0 20rpx 0 30rpx;
		white-space: nowrap;
	}

	.tui-mt {
		margin-top: 30rpx;
		padding-bottom: 150rpx;
	}

	.tui-share-item {
		width: 126rpx;
		display: inline-block;
		margin-right: 24rpx;
		text-align: center;
	}

	.tui-item-last {
		margin: 0;
	}

	.tui-empty {
		display: inline-block;
		width: 30rpx;
		visibility: hidden;
	}

	.tui-share-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fafafa;
		height: 126rpx;
		width: 126rpx;
		border-radius: 32rpx;
	}

	.tui-share-text {
		font-size: 24rpx;
		color: #7E7E7E;
		line-height: 24rpx;
		padding: 20rpx 0;
		white-space: nowrap;
	}

	.tui-btn-cancle {
		width: 100%;
		height: 64rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		background: #fff;
		font-size: 32rpx;
		color: #3e3e3e;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-hover {
		background: rgba(0, 0, 0, 0.2)
	}

	.tui-addr-box {
		padding: 20rpx 0;
	}

	.tui-line-cell {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-title {
		width: 180rpx;
		font-size: 28rpx;
		flex-shrink: 0;
	}

	.tui-title-city-text {
		width: 180rpx;
		height: 40rpx;
		display: block;
		line-height: 46rpx;
	}

	.tui-input {
		width: 500rpx;
	}

	.tui-input-city {
		flex: 1;
		height: 40rpx;
		font-size: 28rpx;
		padding-right: 30rpx;
	}

	.tui-phcolor {
		color: #ccc;
		font-size: 28rpx;
	}

	.tui-cell-title {
		font-size: 28rpx;
		flex-shrink: 0;
	}

	.tui-addr-label {
		margin-left: 70rpx;
	}

	.tui-label-item {
		width: 76rpx;
		height: 40rpx;
		border: 1rpx solid rgb(136, 136, 136);
		border-radius: 6rpx;
		font-size: 26rpx;
		text-align: center;
		line-height: 40rpx;
		margin-right: 20rpx;
		display: inline-block;
		transform: scale(0.92);
	}

	.tui-label-active {
		background: #007AFF;
		border-color: #007AFF;
		color: #fff;
	}

	.tui-swipe-cell {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 10rpx 24rpx;
		box-sizing: border-box;
		border-radius: 6rpx;
		overflow: hidden;
		font-size: 28rpx;
	}

	.tui-switch-small {
		transform: scale(0.8);
		transform-origin: 100% center;
	}

	/* #ifndef H5 */
	.tui-switch-small .wx-switch-input {
		margin: 0 !important;
	}

	/* #endif */

	/* #ifdef H5 */
	>>>uni-switch .uni-switch-input {
		margin-right: 0 !important;
	}

	/* #endif */

	.tui-addr-save {
		padding: 24rpx 30rpx;
		margin-top: 100rpx;
	}

	.tui-del {
		padding: 24rpx 30rpx;
	}
</style>
