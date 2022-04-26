const db = uniCloud.database();
const dbCmd = db.command
let uniID = require('uni-id')
const createConfig = require('uni-config-center')
const uniIdConfig = createConfig({
	pluginId: 'uni-id'
}).config()
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
	let check = await uniID.checkToken(uniIdToken)
	try {
		switch (operation) {
			case "newOrder":
				return await newOrder(data, check);
			case "getOrders":
				return await getOrders(data, check);
			case 'staffListOrders':
				return await staffListOrders(data, check)
			case 'staffBindCard':
				return await staffBindCard(data, check)
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
	console.log(data)
	let {
		current,
		page,
		type
	} = data

	switch (type) {
		case 'send':
			let tm = db.collection("uni-id-base-order").where({
				user_id: check.uid
			})
			let count = await tm.count().then(res => res.total)
			let list = await tm.skip(page * current).orderBy("create_time","desc").limit(page).get()
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
async function staffBindCard(data, check) {
	const promiseArr = [new Promise((resolve, reject) => {
		db.collection("uni-id-base-order").doc(data.order_id).get().then(tm => {
			if (tm.data && tm.data[0] && tm.data[0].bind_card) {
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
			bind_card: data.card_id
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


	let d = await db.collection("uni-id-base-order").doc(data.order_id).update({
		bind_card: data.card_id
	})
	return {
		code: 0,
		data: d,
		msg: "绑定成功"
	}

}
async function staffListOrders(data, check) {
	let condition = {
		bind_card: dbCmd.exists(data.exist),
	}
	let page = data.page
	let current = data.current
	let tm = db.collection("uni-id-base-order").where(condition)

	let count = await tm.count().then(res => res.total)
	let dat = await tm.orderBy("create_time","desc").skip(current * page).limit(page).get()
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
async function newOrder(data, check) {
	let d = await db.collection("uni-id-base-order").add({
		title: "普通物流",
		user_id: check.uid,
		info: data.itemInfo,
		send: data.send,
		receive: data.receive,
		create_time: Date.now()
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
