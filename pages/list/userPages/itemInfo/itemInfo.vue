<template>
	<view>
		<tui-textarea flexStart label="简介" placeholder="请输入简介" v-model="value"></tui-textarea>
		<view class="buttom" style="position: fixed;bottom: 0;left: 0;right: 0;padding: 12rpx 24rpx;padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box;display: flex;justify-content: center;align-items: center;">
			<tui-button type="warning" shape="circle" style="height: 72rpx;width: 640rpx;" @click="onClickButton">确定
			</tui-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: "",
				eventChannel: {}
			}
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel();
		},
		methods: {
			onClickButton(e) {
				this.eventChannel.emit("send_emit", this.value)
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>
