import {
	msg
} from './util'

/**
 * @param {String} cloudFnName
 * @param {String} operation  操作类型（增删改查）
 * @param {Object} data 请求参数
 * @param {Object} ext 附加参数
 */
export const request = (cloudFnName, operation, data = {}, ext = {}) => {
	return new Promise((resolve, reject) => {
		var sysInfo = uni.getSystemInfoSync();
		if (ext.showLoading !== false) {
			uni.showLoading()
		}
		//鉴权过滤
		if(ext.isAuth==true){
			//获取用户的token
			const token = uni.getStorageSync('uni_id_token')
			//token是否已失效
			const tokenExpired = uni.getStorageSync('uni_id_token_expired') < Date.now()
			if(!token||tokenExpired){
				uni.showToast({
					title: '请先登录',
					icon: 'none',
					duration:3000
				})
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/ucenter/login-page/index/index"
					})
				}, 3000)
				return;
			}
		}
		
		uniCloud.callFunction({
			name: cloudFnName,
			data: {
				operation,
				data,
				sysInfo
			}
		}).then(res => {
			if (ext.showLoading !== false) {
				uni.hideLoading()
			}
			console.log("requestResult",res)
			resolve(res.result);
		}).catch((err) => {
			if (ext.showLoading !== false) {
				uni.hideLoading()
			}
			uni.showToast({
				icon:"none",
			    //title: err.toString().replace("Error:",""),
				title:err.toString().split("Error:")[1].replace("[dati]: [FUNCTIONS_EXECUTE_FAIL]",""),
			    duration: 2000
			});
			reject(err);
		})
	})
}
