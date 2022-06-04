<template>
	<view class="content" style="padding: 10rpx;">
		<view style="border: 1rpx dashed #555555;">
			<Signature ref="sig" v-model="v" @finish="onFinish()"></Signature>
		</view>
		<!-- <button @tap="startSign">手动弹出</button> -->
		<!-- <text style="overflow-wrap: break-word;">{{v}}</text> -->
	</view>
</template>

<script>
	import Signature from '@/components/sin-signature/sin-signature.vue'
		import {
			mapActions,
			mapState,
			mapGetters,
			mapMutations
		} from 'vuex';
	import {
		request
	} from '@/common/request'
	export default {
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
				v: '',
				eventChannel: {},
				id: ""
			}
		},
		components: {
			Signature,
		},
		async onLoad(e) {
			this.id = e._id
			console.log(this.id)
			setTimeout(async () => {
				let s = await this.$refs.sig.getSyncSignature();
			}, 200)
			// console.log('组件版本', this.$refs.sig.VERSION);
			// console.log('签名数据', s);
			this.eventChannel = this.getOpenerEventChannel();
		},
		methods: {
			async onFinish(data) {
				data = this.v
				const _this = this;
				const res = await request('orders', 'staffHandle', {
					currentRole: _this.currentRole,
					data: data,
					_id: _this.id,
					type: "sign",
				}, {
					showLoading: true
				});
				uni.navigateBack()
				this.eventChannel.emit("signature", this.v)
				// console.log(this.v)
			},
			async startSign() {
				let s = await this.$refs.sig.getSyncSignature();
				console.log('组件版本', this.$refs.sig.VERSION);
				console.log('签名数据', s);
			}
		}
	}
</script>

<style>
</style>
