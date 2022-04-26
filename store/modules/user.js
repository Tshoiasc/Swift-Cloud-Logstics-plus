// 上次启动时的用户信息
let userInfoHistory = uni.getStorageSync('userInfo') || {};
let orders = uni.getStorageSync('orders') || {}
let systemInfo = uni.getSystemInfoSync();
let state = {
		//是否已经登录
		hasLogin: Boolean(Object.keys(userInfoHistory).length),
		//用户信息
		info: userInfoHistory,
		systemInfo: systemInfo,
		orders: orders
	},
	getters = {
		info(state) {
			return state.info;
		},
		systemInfo() {
			return state.systemInfo
		},
		hasLogin(state) {
			return state.hasLogin;
		},
		orders() {
			return state.orders
		}
	},
	mutations = {
		login(state, info) { //登录成功后的操作
			//原有的结合传来的参数
			let _info = state.info;
			state.info = Object.assign({}, _info, info);
			//设置为已经登录
			state.hasLogin = true;
			console.log('state.info', state.info);
			//换头像
			// uniCloud.getTempFileURL({
			// 	fileList: [state.info.avatar_file.url]
			// }).then(res => {
			// 	console.log(res)
			// })

			//存储最新的用户数据到本地持久化存储
			uni.setStorageSync('userInfo', state.info);
			if (info.token) {
				uni.setStorage({
					key: 'uni_id_token',
					data: state.info.token,
					complete(e) {
						// console.log('setStorage-------',e);
					}
				});
				uni.setStorageSync('uni_id_token_expired', state.info.tokenExpired)
			}
		},
		logout(state) {
			state.info = {};
			state.hasLogin = false;
			state.orders = {}
			uni.setStorageSync('userInfo', {});
			uni.removeStorageSync('uni_id_token');
			uni.setStorageSync('uni_id_token_expired', 0)
			uni.setStorageSync("orders", {})
		},
		setOrders(state, orders) {
			state.orders = orders
			uni.setStorageSync("orders", orders)
		},
		setOrder(state, data) {
			console.log("触发了")
			console.log("----1---")
			let _data = state.orders
			console.log(state.orders)
			let d = {}
			d[data.type] = data.list
			state.orders = Object.assign({}, _data, d);
			console.log(state.orders)
			uni.setStorageSync("orders", state.orders)
			console.log("----0---")
		}
	},
	actions = {
		logout(context) {
			uni.showLoading({
				mask: true
			})
			uniCloud.callFunction({
				name: 'uni-id-cf',
				data: {
					action: 'logout'
				},
				complete: (e) => {
					console.log(e);
					context.commit('logout')
					uni.hideLoading()
				}
			})
		}
	}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
