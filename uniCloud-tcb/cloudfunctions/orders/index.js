const db = uniCloud.database();
const dbCmd = db.command
let uniID = require('uni-id')
const createConfig = require('uni-config-center')
const {
	lookup
} = require('dns');
const uniIdConfig = createConfig({
	pluginId: 'uni-id'
}).config()
/**
 * order状态   待揽收 submit  已揽收 send  运送中 transport  派送中 delivery  已签收 sign
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
	//UNI_WYQ:这里的uniID换成新的，保证多人访问不会冲突
	uniID = uniID.createInstance({
		context
	})
	console.log('event : ' + JSON.stringify(event))
	const {
		operation,
		data,
		sysInfo,
		uniIdToken
	} = event;
	// console.log('sysInfo : ' + JSON.stringify(sysInfo))
	// console.log('uniIdToken : ', uniIdToken)
	console.log(data)
	let check = await uniID.checkToken(uniIdToken)
	if (check.code) {
		return check
	}
	console.log("check", check)
	let needLook = ["staffHandle", "staffListOrdersToDeliver"]
	let check_role
	if (needLook.indexOf(operation) != -1) {
		//检查传的role是否正确
		try {
			check_role = await db.collection("office_taken").doc(data.currentRole._id).get().then(async res => {
				let data = res.data[0]
				let position_id = data.position_id[0]
				let office_id = data.office_id
				let office = await db.collection("opendb-department").doc(office_id).get()
				office = office.data[0]
				let position = await db.collection("position").where({
					role_id: position_id
				}).get()
				position = position.data[0]
				let permissions = position.permission
				return {
					code: 0,
					data: {
						office,
						position,
						permissions
					}
				}
			})

		} catch (e) {
			console.log(e)
			check_role = {
				code: -1,
				msg: "非法操作"
			}
		}
		console.log(check_role)
		if (check_role.code) {
			return check_role
		}
		check_role = check_role.data
	}

	try {
		switch (operation) {
			case "newOrder":
				return await newOrder(data, check);
			case "getOrders":
				return await getOrders(data, check);
			case 'staffListOrders':
				return await staffListOrders(data, check, check_role)
			case 'staffHandle':
				return await staffHandle(data, check, check_role)
			case 'staffVerifyCard':
				return await staffVerifyCard(data, check, check_role)
			case 'staffGetOrderInfo':
				return await staffGetOrderInfo(data, check)
			case 'staffListOrdersToDeliver':
				return await staffListOrdersToDeliver(data, check, check_role)
			case 'getOrderInfo':
				return await getOrderInfo(data, check)
			default: {
				throw new Error("未找到接口")
			}
		}
	} catch (e) {
		var msg = e.toString().replace("Error: ", "")
		console.log("出错了", msg)
		return {
			code: 50101,
			msg: msg
		};
	}
}
/**
 * 查看自己的订单
 * @param {*} data 
 * @param {*} check 
 */
async function getOrders(data, check) {

	console.log(data, check)
	let {
		current,
		page,
		type
	} = data
	switch (type) {
		case 'send':
			let tm = db.collection("uni-id-base-order")
			let count = await tm.where({
				user_id: check.uid
			}).count().then(res => res.total)
			// let list = await tm.skip(page * current).orderBy("create_time", "desc").limit(page).get()
			let list = await tm.aggregate().match({
				user_id: check.uid
			}).lookup({
				from: 'uni-id-users',
				localField: 'bind_info.user_id',
				foreignField: '_id',
				as: 'bind_info.binder'
			}).project({
				'bind_info.binder.dcloud_appid': 0,
				'bind_info.binder.inviteCode': 0,
				'bind_info.binder.last_login_data': 0,
				'bind_info.binder.last_login_ip': 0,
				'bind_info.binder.login_ip_limit': 0,
				'bind_info.binder.password': 0,
				'bind_info.binder.register_date': 0,
				'bind_info.binder.register_ip': 0,
				"bind_info.binder.tags": 0,
				"bind_info.binder.token": 0
			}).end()
			console.log(list)

			return {
				code: 0,
					data: {
						list: list.data,
						current: current,
						count
					}
			}
			default:
				return {
					code: 0,
						data: {
							list: [],
							current: current,
							count: 0
						}
				}
	}

}
async function staffHandle(data, check, check_role) {
	if (data.type === 'bind') {
		//绑定卡片
		const promiseArr = [new Promise((resolve, reject) => {
			db.collection("uni-id-base-order").doc(data.order_id).get().then(tm => {
				if (tm.data && tm.data[0] && tm.data[0].bind_info && tm.data[0].bind_info
					.cardId) {
					resolve({
						code: 1,
						msg: "该包裹已绑定其他卡"
					})
				}
				resolve({
					code: 0
				})
			})

		}), new Promise((resolve, reject) => {
			db.collection("uni-id-base-order").where({
				'bind_info.cardId': data.card_id
			}).count().then(tt => {
				if (tt.total >= 1) {
					resolve({
						code: 2,
						msg: "该卡已绑定过其他包裹"
					})
				}
				resolve({
					code: 0
				})
			})

		})]
		let res = await Promise.all(promiseArr)
		let fil = res.filter(a => a.code != 0)
		if (fil.length > 0) return fil[0]

		delete check.password

		console.log("check_role", check_role)
		let d = await db.collection("uni-id-base-order").doc(data.order_id).update({
			bind_info: {
				cardId: data.card_id,
				user_id: check.uid,
				detailData: {
					office: check_role.office,
					position: check_role.position,
					userInfo: {
						username: check.userInfo.username,
						nickname: check.userInfo.nickname,
						email: check.userInfo.email,
						mobile: check.userInfo.mobile
					}
				}
			},
			progress: [{
				office: check_role.office,
				position: check_role.position,
				userInfo: {
					username: check.userInfo.username,
					nickname: check.userInfo.nickname,
					email: check.userInfo.email,
					mobile: check.userInfo.mobile
				},
				type: "bind",
				time: Date.now()
			}],
			current_office: check_role.office,
			status: "send"
		})
		return {
			code: 0,
			data: d,
			msg: "绑定成功"
		}
	} else if (data.type === 'verify') {
		const promiseArr = [new Promise((resolve, reject) => {
			db.collection("uni-id-base-order").where({
				'bind_info.cardId': data.card_id
			}).get().then(tm => {
				if (!(tm.data && tm.data[0] && tm.data[0].bind_info && tm.data[0].bind_info
						.cardId)) {
					resolve({
						code: 1,
						msg: "该包裹还未入库"
					})
				}
				resolve({
					code: 0
				})
			})

		}), new Promise((resolve, reject) => {
			db.collection("uni-id-base-order").where({
				'bind_info.cardId': data.card_id
			}).get().then(tm => {
				if ((tm.data && tm.data[0] && tm.data[0].progress && tm.data[0].progress
						.length && tm.data[0].progress[tm
							.data[0].progress.length - 1].office._id === check_role.office._id
					)) {
					resolve({
						code: 2,
						msg: "该包裹已被该组织验视完成"
					})
				}
				resolve({
					code: 0
				})
			})

		})]
		let res = await Promise.all(promiseArr)
		let fil = res.filter(a => a.code != 0)
		if (fil.length > 0) return fil[0]

		delete check.password

		console.log("check_role", check_role)
		let d = await db.collection("uni-id-base-order").where({
			'bind_info.cardId': data.card_id
		}).update({
			progress: dbCmd.push({
				office: check_role.office,
				position: check_role.position,
				userInfo: {
					username: check.userInfo.username,
					nickname: check.userInfo.nickname,
					email: check.userInfo.email,
					mobile: check.userInfo.mobile
				},
				time: Date.now(),
				type: "verify"
			}),
			current_office: check_role.office,
			status: "transport"
		})
		return {
			code: 0,
			data: d,
			msg: "验视成功"
		}
	} else if (data.type === 'delivery') {
		if (data.cls === 'all') {
			let res = await db.collection("uni-id-base-order").where({
				"current_office._id": check_role.office._id
			}).update({
				progress: dbCmd.push({
					office: check_role.office,
					position: check_role.position,
					userInfo: {
						username: check.userInfo.username,
						nickname: check.userInfo.nickname,
						email: check.userInfo.email,
						mobile: check.userInfo.mobile,
						avatar_file: check.userInfo.avatar_file
					},
					time: Date.now(),
					type: data.close ? 'undelivery' : "delivery"
				}),
				current_office: check_role.office,
				status: "delivery"
			})

		} else {
			let re = await db.collection("uni-id-base-order").doc(data._id).update({
				progress: dbCmd.push({
					office: check_role.office,
					position: check_role.position,
					userInfo: {
						username: check.userInfo.username,
						nickname: check.userInfo.nickname,
						email: check.userInfo.email,
						mobile: check.userInfo.mobile,
						avatar_file: check.userInfo.avatar_file
					},
					time: Date.now(),
					type: data.close ? 'undelivery' : "delivery"
				}),
				current_office: check_role.office,
				status: "delivery"
			})
		}
		return {
			code: 0,
			msg: "操作成功"
		}


	} else if (data.type === 'sign') {
		let res = await db.collection("uni-id-base-order").doc(data._id).update({
			progress: dbCmd.push({
				office: check_role.office,
				position: check_role.position,
				userInfo: {
					username: check.userInfo.username,
					nickname: check.userInfo.nickname,
					email: check.userInfo.email,
					mobile: check.userInfo.mobile,
					avatar_file: check.userInfo.avatar_file
				},
				time: Date.now(),
				type: "sign",
				detailData: {
					svg: data.data
				}
			}),
			current_office: check_role.office,
			sign_data: {
				svg: data.data
			},
			status: "sign"
		})

		return {
			code: 0,
			msg: "操作成功"
		}


	}


}
async function staffListOrders(data, check) {
	console.log(data, check)
	let condition = {
		status: dbCmd.eq(data.status),
	}
	if (data.status === 'transport') {

	}
	let page = data.page
	let current = data.current
	let tm = db.collection("uni-id-base-order").where(condition)

	let count = await tm.count().then(res => res.total)
	let dat = await tm.orderBy("create_time", "desc").skip(current * page).limit(page).get()
	console.log(count, dat)
	return {
		code: 0,
		data: {
			list: dat.data,
			current: current,
			count
		}
	}

}
async function staffListOrdersToDeliver(data, check, check_role) {
	console.log(check_role.office._id)
	let condition = {
		'current_office._id': check_role.office._id,
		'status': dbCmd.in(["transport", "delivery"])
	}
	let page = data.page
	let current = data.current
	let tm = db.collection("uni-id-base-order").where(condition)

	let count = await tm.count().then(res => res.total)
	let dat = await tm.skip(current * page).limit(page).get()
	console.log(count, dat)
	return {
		code: 0,
		data: {
			list: dat.data,
			current: current,
			count
		}
	}

}
async function staffGetOrderInfo(data, check, check_role) {
	console.log(data, check)
	let condition = {
		'bind_info.cardId': data.card_id,
	}
	let dat = await db.collection("uni-id-base-order").where(condition).limit(1).get()
	if (dat && dat.data && dat.data.length) {
		return {
			code: 0,
			data: dat.data[0]
		}
	} else {
		return {
			code: 1,
			msg: "未找到该卡绑定订单"
		}
	}


}
async function getOrderInfo(data, check) {
	console.log(data)
	if (!data._id) {
		return {
			code: 5,
			msg: "参数错误"
		}
	}
	console.log(data._id)
	let dat = await db.collection("uni-id-base-order").doc(data._id).get()
	if (!dat.data || !dat.data.length) {
		return {
			code: 4,
			msg: "未查找到结果"
		}
	}
	dat = dat.data[0]
	console.log(dat, check)
	if (check.uid != dat.user_id) {
		return {
			code: 1,
			msg: "不是您的订单"
		}
	}
	return {
		code: 0,
		data: dat
	}
	// if (dat && dat.data && dat.data.length) {
	// 	return {
	// 		code: 0,
	// 		data: dat.data[0]
	// 	}
	// } else {
	// 	return {
	// 		code: 1,
	// 		msg: "未找到该卡绑定订单"
	// 	}
	// }


}
async function newOrder(data, check) {
	let d = await db.collection("uni-id-base-order").add({
		title: "普通物流",
		user_id: check.uid,
		info: data.itemInfo,
		send: data.send,
		receive: data.receive,
		create_time: Date.now(),
		status: "submit"
	})
	console.log(d)
	if (d.id) {
		return {
			code: 0,
			data: {
				_id: d._id
			}
		}
	} else {
		return {
			code: 1,
			msg: "失败"
		}
	}
	console.log(d)
}
