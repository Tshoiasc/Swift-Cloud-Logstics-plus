<template>
	<page-meta page-style="background-color:#f7f7f7" background-color="#f7f7f7">

	</page-meta>
	<view>
		<view class="header" style="height: 56rpx;">
			<tui-tabs :tabs="tabs" :currentTab="currentTab" @change="change" sliderBgColor="#5483ee"
				backgroundColor="#f7f7f7" selectedColor="#5483ee" itemWidth="50%" :size="36"></tui-tabs>
		</view>


		<swiper :indicator-dots="false" scroll-x style="height: 100vh;padding-top:72rpx;" :current="currentTab"
			@change="change">
			
			<swiper-item v-for="item in [1,2]">
				<view class=""
					v-if="!list || !list.length || (item == 1?!list.filter(a=>a.cls =='send').length : !list.filter(a=>a.cls=='receive').length)">
					<tui-no-data imgUrl="/static/images/toast/img_nodata.png">暂无数据</tui-no-data>
				</view>
				<tui-radio-group @change="changeRatio" :value="ratio" v-else>
					<view class="card column" v-for="(data,index) in list"
						v-if="item == 1?data.cls == 'send' : data.cls=='receive'">
						<view class="" @click="onClickCard(data)">
							<view class="flex title-box">
								<view class="name">
									{{data.name}}
								</view>
								<view class="phone">
									{{data.phone}}
								</view>
							</view>
							<view class="address">
								{{(data.city.text?data.city.text:"") + data.address}}
							</view>
						</view>

						<view class="bottom-button flex">
							<tui-radio color="#5483ee" :value="''+index" :scaleRatio="0.65" borderColor="#999"
								size="22">
							</tui-radio>
							<text class="tui-text" style="margin-left: 12rpx;font-size: 28rpx"
								@click="changeRatio({'detail':{'value':''+index}})">设为默认地址</text>
							<view class="right flex">
								<view class="button flex" @click="onEdit(data,index)">
									<tui-icon name="feedback" size="16" color="#aaa"></tui-icon>
									<text>编辑</text>
								</view>
								<view class="button flex" style="margin-left: 20rpx;" @click="onDelete(data,index)">
									<tui-icon name="delete" size="16" color="#aaa"></tui-icon>
									<text>删除</text>
								</view>
							</view>
						</view>
					</view>
				</tui-radio-group>
			</swiper-item>

		</swiper>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				tabs: [{
					name: "寄件人"
				}, {
					name: "收件人"
				}],
				currentTab: 0,
				list: [],
				eventChannel: {},
				ratio: ""
			}
		},
		onShow() {
			// #ifdef APP-PLUS
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			this.list = uni.getStorageSync("offen_address")
		},
		onLoad(e) {
			this.eventChannel = this.getOpenerEventChannel();
		},
		onNavigationBarButtonTap(e) {
			console.log(e)
			if (e.text == '添加') {
				//添加地址
				uni.navigateTo({
					url: `./edit/edit?type=add&cls=${this.currentTab == 0 ?'send':'receive'}`
				})
			}
		},
		methods: {
			onDelete(data, i) {
				let _this = this
				uni.showModal({
					title: "温馨提示",
					content: "确认要删除吗？",
					success: (e) => {
						if (e.confirm === true) {

							_this.list.splice(i, 1)
							uni.setStorageSync("offen_address", _this.list)
						}
					}
				})
			},
			onEdit(e, index) {
				e.storeIndex = index
				console.log(e)
				uni.navigateTo({
					url: `./edit/edit?type=edit&data=${JSON.stringify(e)}`
				})

			},
			changeRatio(e) {
				console.log(e)
				this.ratio = e.detail.value
			},
			change(e) {
				let index = e.detail ? e.detail.current : e.index
				this.currentTab = index
			},
			onClickCard(e) {
				uni.navigateBack()
				this.eventChannel.emit("send_emit", e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f7f7;
	}

	.header {
		position: fixed;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f7f7f7;
		z-index: 99999;
		border-bottom: 1rpx solid #eee;
	}

	.card {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx 28rpx;
		margin: 12rpx 24rpx;
		box-shadow: 0 0 12rpx #eeeeee55;

		.title-box {
			padding: 8rpx 0rpx;
		}

		.name,
		.phone {
			font-size: 32rpx;
			color: #333;
			font-weight: 500;
		}

		.address {
			padding: 8rpx 0;
			font-weight: 400;
			color: #999;
			font-size: 28rpx;
		}

		.phone {
			margin-left: 12rpx;
		}
	}

	.flex {
		display: flex;
		align-items: center;
	}

	.button {
		font-size: 28rpx;

		text {
			margin-left: 4rpx;
			color: #999;
		}
	}

	.bottom-button {
		margin-top: 24rpx;
	}

	.right {
		margin: 0 0 0 auto;
	}
</style>
