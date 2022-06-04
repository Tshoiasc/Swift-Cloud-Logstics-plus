<template>
	<view style="width:750rpx;align-items: center;display: flex;justify-content: center;">
		<orderDetailComp :info="info" v-if="info._id">

		</orderDetailComp>
		<view v-else>
			<u-empty style="margin-top: 120rpx;" mode="data" textSize="16" width="180" height="180">
			</u-empty>
		</view>

		<view class="fab" @click="onClickUp" v-if="!info._id"
			style="height:108rpx;width: 108rpx; background-color: #5677fc;border-radius: 1000px;position: fixed;right: 24rpx;bottom: 64rpx;display:flex;align-items:center;justify-content: center;">
			<image src="/static/images/other/nfc.png" mode="aspectFit" style="height: 84rpx;width: 84rpx;"></image>
		</view>

		<view class="fab" @click="ignore" v-if="info._id"
			style="height:108rpx;width: 108rpx; background-color: #dc4147;opacity:.8;border-radius: 1000px;position: fixed;right: 146rpx;bottom: 64rpx;display:flex;align-items:center;justify-content: center;">
			<u-icon name="close" color="#fff" size="26" :bold="true"></u-icon>
		</view>

		<view class="fab" @click="pass" v-if="info._id"
			style="height:108rpx;width: 108rpx; background-color: #4fd678;opacity:.8;border-radius: 1000px;position: fixed;right: 24rpx;bottom: 186rpx;display:flex;align-items:center;justify-content: center;">
			<u-icon name="checkmark" color="#fff" size="26" :bold="true"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		request
	} from '@/common/request'
	import {
		mapActions,
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';
	import orderDetailComp from '../orderDetailComp';
	import tuiSegmentedControl from "@/components/thorui/tui-segmented-control/tui-segmented-control"
	import orderCard from '@/pages/order/order_app/orderCard';
	// var nfcModule = uni.requireNativePlugin("Am-NFCReaderIDUniPlugin-TestModule")
	var nfcModule = uni.requireNativePlugin("yzy-YzyNfcTagRead")
	// const nfcModule = uni.requireNativePlugin("yzy-YzyNfcTagRead")
	import android_nfc from '../pushInStore/android_nfc.js';
	var NfcAdapter;
	var NdefRecord;
	var NdefMessage;
	var waiting;
	var readyRead = false;
	var nfcAdapter, main, pendingIntent, intentFiltersArray, techListsArray, IntentFilter;
	export default {
		components: {
			orderCard,
			orderDetailComp,
			tuiSegmentedControl
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				hasLogin: 'user/hasLogin',
				systemInfo: 'user/systemInfo',
				role: "user/role",
				currentRole: "user/currentRole"
			})
		},
		data() {
			return {
				info: {

				},
				fab_content: {
					iconPath: "/static/images/other/nfc.png"
				},
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				currentNFCInfo: [], //NFC 读取消息；
				bannerShow: false,
				remark: '',
				message: '',
				count: 0,
				timestampHide: '',
				timestampShow: '',
				scrollTop: 0,
				subNVue: {},
				current: -1,
				list: [],
			}
		},
		onLoad() {},
		onNavigationBarButtonTap(e) {
			this.onClickUp()
		},
		onReady() {
			if (this.systemInfo.platform == 'ios') {
				return;
			}
			const subNVue = uni.getSubNVueById('sub_nfc')
			uni.$on("sub_nfc_show", (e) => {
				if (e.show) {

				} else {
					try {
						android_nfc.removeListener()
					} catch (e) {

					}
				}
			})
		},
		methods: {

			read() {

				let that = this
				nfcModule.TagNfcReadAsyncFunc({
					'name': 'yzyzuishuai'
				}, (res) => {
					console.log(res)
					if (res.type != 1) {
						plus.nativeUI.alert(res.msg, () => {
							2
						}, "提示", "确定")
						return;
					}
					this.bindCard(res.msg).then(res => {
						if (res.code) {
							plus.nativeUI.alert(res.msg, () => {

							}, "提示", "确定")
							return;
						}
						plus.nativeUI.alert("验视完成", () => {

						}, "提示", "确定")
						that.refresh()
					})

				})
			},
			refresh() {
				this.getData().then(res => {
					if (res.code) {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						return;
					}
					this.list = {
						...res.data,
						init: true
					}
				})
			},
			async bindCard(card_id) {
				//先展示数据
				console.log(card_id)
				const info = await request('orders', 'staffGetOrderInfo', {
					card_id
				})
				console.log(info)
				if (info.code) {
					uni.showToast({
						title: info.msg,
						icon: "none"
					})
					return;
				}
				this.info = info.data
				// this.handleStatus(info.data)
				// const res = await request('orders', 'staffHandle', {
				// 	card_id,
				// 	currentRole: this.currentRole,
				// 	type: "verify"
				// });
			},
			onClickUp() {
				let that = this
				if (this.systemInfo.platform == 'ios') {
					this.read()
				} else {
					const subNVue = uni.getSubNVueById('sub_nfc')

					subNVue.show('slide-in-bottom', 300, function() {
						uni.$emit("sub_nfc_show", {
							show: true
						})
						android_nfc.listenNFCStatus(res => {
							if (res.type == 'start') {
								uni.showLoading({
									title: "读取中"
								})
							} else if (res.type == 'end') {
								uni.hideLoading()

								if (!res.result.techlist.includes("NfcV")) {
									plus.nativeUI.alert("卡片格式错误", () => {}, "警告", "确定")
								} else {
									uni.showLoading({
										title: "读取成功,正在上传。"
									})
									console.log(res)
									that.bindCard(res.result.tagId).then(res => {
										if (res.code) {
											plus.nativeUI.alert(res.msg, () => {

											}, "提示", "确定")
											return;
										}
										plus.nativeUI.alert("验视完成", () => {

										}, "提示", "确定")
										that.refresh()
									})
								}

								subNVue.hide("slide-out-bottom", 300)
							}

						})
					});
				}

			},
			ignore() {
				this.info = {}
			},
			async pass() {
				
				const _this = this
				console.log(_this.info._id)
				// if (this.currentRole.department._id != _this.info.current_office._id) {
				// 	console.log(this.currentRole, this.info.current_office)
				// 	uni.showToast({
				// 		title: "该包裹不在当前操作组织",
				// 		icon: "none"
				// 	})
				// 	return;
				// }
				const res = await request('orders', 'staffHandle', {
					card_id: _this.info.bind_info.cardId,
					currentRole: _this.currentRole,
					type: "verify"
				});
				console.log(res)
				if (res && res.msg) {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
				}
				this.info = {}
			},

			sectionChange(index) {
				console.log(index)
				this.current = index.index;
			}
		}
	}
</script>

<style>

</style>
