// 上次启动时的用户信息
let userInfoHistory = uni.getStorageSync('userInfo') || {};
let orders = uni.getStorageSync('orders') || {}
let systemInfo = uni.getSystemInfoSync();
let role = uni.getStorageSync("role") || {}
let currentRole = uni.getStorageSync("currentRole") || {}
let state = {
		//是否已经登录
		hasLogin: Boolean(Object.keys(userInfoHistory).length),
		//用户信息
		info: userInfoHistory,
		systemInfo: systemInfo,
		orders: orders,
		role: role,
		currentRole: currentRole
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
		},
		role() {
			return state.role
		},
		currentRole() {
			return state.currentRole
		}
	},
	mutations = {
		login(state, info) { //登录成功后的操作
			//原有的结合传来的参数
			let _info = state.info;
			state.info = Object.assign({}, _info, info);
			//设置为已经登录
			state.hasLogin = true;
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
			state.role = Object.assign({}, {})
			state.currentRole = Object.assign({}, {})
			uni.setStorageSync('userInfo', {});
			uni.removeStorageSync('uni_id_token');
			uni.setStorageSync('uni_id_token_expired', 0)
			uni.setStorageSync("orders", {})
			uni.setStorageSync("currentRole", {})
			uni.setStorageSync("role", {})
		},
		setOrders(state, orders) {
			state.orders = orders
			uni.setStorageSync("orders", orders)
		},
		setOrder(state, data) {
			let _data = state.orders
			console.log(state.orders)
			let d = {}
			d[data.type] = data.list
			state.orders = Object.assign({}, _data, d);
			uni.setStorageSync("orders", state.orders)
		},
		setRole(state, data) {
			state.role = data
			uni.setStorageSync("role", state.role)
			if (data && data.list && data.list.length) {
				uni.setTabBarItem({
					index: 2,
					visible: true
				})
			} else {
				uni.setTabBarItem({
					index: 2,
					visible: false
				})
			}
		},
		setCurrentRole(state, data) {
			state.currentRole = data
			uni.setStorageSync("currentRole", state.currentRole)
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
					uni.setTabBarItem({
						index: 2,
						visible: true
					})
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
