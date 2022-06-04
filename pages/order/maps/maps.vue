<template>
	<view class="maps-container">
		<map id="map" class="tui-map" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap="marker"
			:polyline="polyline" :scale="scale" :show-location="false"></map>
		<view class="image-box">
			<image
				src="https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/yj2.png?sign=ec3d921324c74f84293d5e108a0a3644&t=1649815688"
				mode="heightFix" style="height: 72rpx;z-index: 9999999;"></image>
			<text
				style="color: #fff;font-weight: bold;font-size: 20rpx;margin-top: -6rpx;padding-bottom: 12rpx;white-space: nowrap;">云极速递+</text>
		</view>
		<view class="status-bar">
			<view class="flex" style="justify-content: center;">
				<view class="from">
					<text class="address">
						{{data.send?handleAddress(data.send):""}}
					</text>
					<text class="name">
						{{data.send?data.send.name:""}}
					</text>
				</view>
				<view class="status">
					<image class="arrow"
						src="https://6e66-nfc-7g80xpae1553a28a-1307546242.tcb.qcloud.la/%E7%AE%AD%E5%A4%B4.png?sign=b3cb2d20ede8c8e6667d67c3d379192b&t=1650360723"
						mode="scaleToFill"></image>
					<text class="status-content">
						{{judgeStatus(data).text}}
					</text>
				</view>
				<view class="to">
					<text class="address">
						{{data.receive?handleAddress(data.receive):""}}
					</text>
					<text class="name">
						{{data.receive?data.receive.name:""}}
					</text>
				</view>
			</view>

		</view>


		<!-- 			<view class="g" style="width: 180rpx;height: 6px;background-color:rgba(0,0,0,.3);border-radius: 12rpx;">
			</view> -->
		<view class="" :style="'height: '+winHeight+'px;'+'border-radius:25rpx;overflow:hidden'">
			<scroll-view scroll-y="true" :style="'height: '+winHeight+'px;'">
				<orderDetailComp :info="data"></orderDetailComp>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import QQMapWX from '@/libs/qqmap-wx-jssdk.min.js';
	import utils from '@/components/common/tui-utils/tui-utils.js'
	import orderDetailComp from '@/pages/app/apps/orderDetailComp.vue'
	import {
		request
	} from '@/common/request'
	export default {
		components: {
			orderDetailComp
		},
		data() {
			return {
				inputShowed: false,
				inputVal: "",
				qqmapsdk: null,
				bz: [],
				button_list: [{
						name: 'compose',
						title: '反馈意见',
						event: () => uni.navigateTo({
							url: "/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback"
						})
					},
					{
						name: 'headphones',
						title: '在线客服'
					}
				],
				key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
				latitude: 22.63137,
				longitude: 114.010857,
				covers: [],
				address: [],
				scrollH: 0,
				pageIndex: 1,
				loading: true,
				winHeight: 600,
				pullUpOn: true,
				keywords: '',
				polyline: [],
				scale: 12,
				end_point: "36.18359383595297,120.37397938541415",
				end_result: {},
				pan_Binding: {},
				reset_Binding: 0,
				statusY: 0,
				currentY: 0,
				data: {},
				kdy: {}
			}
		},
		async onLoad(options) {
			const _this = this
			this.qqmapsdk = new QQMapWX({
				key: _this.key
			});

			console.log(options._id)
			let data = await request('orders', 'getOrderInfo', {
				_id: options._id
			}, {
				showLoading: false
			});
			// let data = await uniCloud.database().collection("uni-id-base-order").doc(options._id).get().then(res => res
			// 	.data)

			if (data.code) {
				uni.hideLoading()
				uni.showToast({
					title: data.msg,
					icon: "none"
				})
				return;
			}
			data = data.data
			console.log(data)
			this.data = data
			this.handleStatus(data)

			// this.keywords = options.key || '加油站';
			setTimeout(async () => {
				let winHeight = uni.getSystemInfoSync().windowHeight;
				this.windowHeight = winHeight
				this.scrollH = winHeight - 44 - uni.upx2px(900);
				// this.getLocation(() => {
				// 	setTimeout(() => {
				// 		this.getPoiAround(this.keywords)
				// 		setTimeout(() => {
				// 			this.test()
				// 		}, 3500)
				// 	}, 1000)
				// });
				await this.test(data)
			}, 500)
		},
		onReady() {

			// let winHeight = uni.getSystemInfoSync().windowHeight

		},

		methods: {
			handleStatus(data) {
				let zd = [{
					icon: "checkbox-mark",
					title: "已签收"
				}, {
					icon: "clock",
					title: "派送中"
				}, {
					icon: "car",
					title: "运送中"
				}, {
					icon: "share-square",
					title: "已揽收"
				}, {
					icon: "edit-pen",
					title: "已提交"
				}]
				let result = []
				switch (data.status) {
					case "sign":
						result.push({
							...zd[0],
							obj: [{
								text: "您的包裹已签收"
							}]
						})
					case "delivery":
						result.push({
							...zd[1],
							obj: data.progress.filter(a => a.type == 'delivery' || a.type == 'undelivery').map(
								a => {
									return {
										text: a.type == 'delivery' ? `您的包裹正在派送中,派送员${a.userInfo.nickname}` :
											'本次派送失败，请再次预约时间派送',
										time: a.time
									}
								}).reverse()
						})
					case "transport":
						result.push({
							...zd[2],
							obj: data.progress.filter(a => a.type == 'verify').map(a => {
								return {
									text: `您的包裹已抵达${a.office.name},由${a.userInfo.nickname}完成验视`,
									time: a.time
								}
							}).reverse()
						})
					case "send":
						result.push({
							...zd[3],
							obj: [{
									text: `您的包裹已被${data.bind_info.detailData.office.name}揽收,操作人:${data.bind_info.detailData.userInfo.nickname}`
								}

							]
						})
					case "submit":
						result.push({
							...zd[4],
							obj: [{
								text: "您的包裹已提交"
							}]
						})
					default:

				}
				this.bz = result
				console.log(result)


			},
			reset() {

				const movable = this.$refs.movable.ref
				const _this = this
				let reset_Binding = Binding.bind({
						anchor: movable,
						eventType: "timing",
						exitExpression: "t>800",
						props: [{
							element: movable,
							property: "transform.translateY",
							expression: "easeOutElastic(t," + self.x + "," + changed_x + ",800)"
						}]
					},
					function(e) {
						if (e.state === 'exit') {
							console.log("结束")
							Binding.unbind({
								token: _this.reset_Binding.token,
								eventType: "pan"
							})
							_this.reset_Binding = 0
						}
					})
				this.reset_Binding = reset_Binding.token
			},
			test: async function(e) {
				uni.showLoading({
					title: "获取订单详情中",
					mask: true
				})
				let _this = this
				let marker_arr = []
				//获取当前坐标
				// let currentLocation = await new Promise((resolve, reject) => {
				// _this.getLocation((res) => {
				// 	resolve(res)
				// })
				// })
				let currentLocation = e.send.area.location
				this.latitude = currentLocation.lat
				this.longitude = currentLocation.lng
				console.log(_this.data.send)
				//marker

				marker_arr.push({
					id: 1,
					latitude: currentLocation.lat,
					longitude: currentLocation.lng,
					iconPath: "/static/images/maps/location.png",
					height: 40,
					width: 40,
					callout: {
						content: "出发点 | " + e.send.area.address_components.city,
						fontSize: 12,
						display: "ALWAYS",
						color: "#333",
						textAlign: "center",
						bgColor: "#fff",
						borderRadius: 12,
						padding: 8,
						borderColor: "#ccc",
						borderWidth: 1
					}
				});
				console.log(1)
				this.end_point = {
					latitude: e.receive.area.location.lat,
					longitude: e.receive.area.location.lng
				}

				console.log(2)
				marker_arr.push({
					id: 3,
					...this.end_point,
					iconPath: "/static/images/maps/location.png",
					height: 40,
					width: 40,
					callout: {
						content: "终点 | " + e.receive.area.address_components.city,
						fontSize: 12,
						display: "ALWAYS",
						color: "#333",
						textAlign: "center",
						bgColor: "#fff",
						borderRadius: 12,
						padding: 8,
						borderColor: "#ddd",
						borderWidth: 1
					}
				});
				console.log(3)
				if (e.status != "sign") {
					marker_arr.push({
						id: 2,
						latitude: currentLocation.lat,
						longitude: currentLocation.lng,
						// title: "出发点",
						iconPath: "/static/images/maps/car.png",
						height: 54,
						width: 35,
						anchor: {
							x: 0.5,
							y: 0.5
						},
						callout: {
							content: "",
							display: "BYCLICK",
							bgColor: "transparent",
						}
					});
				}

				console.log(4)
				console.log(marker_arr)
				//逆解析终点
				// console.log(this.end_point)
				// let end = await new Promise((resolve, reject) => {
				// 	this.qqmapsdk.reverseGeocoder({
				// 		location: this.end_point,
				// 		success: function(res) {
				// 			_this.end_result = res.result
				// 			_this.covers = [res.result]
				// 			let MapContext = uni.createMapContext("#map", _this);
				// 			MapContext.moveToLocation(_this.end_result)
				// 			resolve(res.result)
				// 		},
				// 		fail: function(res) {
				// 			console.log(res);
				// 		},
				// 		complete: function(res) {
				// 			console.log(res);
				// 		}
				// 	});
				// })
				// let need = ["陕西省汉中市陕西理工大学"]
				// need.forEach(e => {
				// 	setTimeout(() => {
				// 		this.qqmapsdk.geocoder({
				// 			address: e,
				// 			success: (f) => {
				// 				console.log(e)
				// 				console.log(f)
				// 			}
				// 		})
				// 	}, 200)

				// })

				//打标记
				let middle_loc = null
				if (e.progress && e.progress.length) {
					let middle = e.progress[e.progress.length - 1].office.location
					middle_loc = {
						latitude: middle.lat,
						longitude: middle.lng
					}
				}
				let movealong = null
				this.polyline = await new Promise(async (resolve, reject) => {
					let qj
					if (middle_loc) {
						qj = [{
							from: {
								latitude: _this.latitude,
								longitude: _this.longitude
							},
							to: middle_loc
						}, {
							from: middle_loc,
							to: _this.end_point
						}]
					} else {
						qj = [{
							from: {
								latitude: _this.latitude,
								longitude: _this.longitude
							},
							to: _this.end_point
						}]
					}
					let pmr = []
					qj.forEach(line => {
						console.log(line)
						pmr.push(new Promise((resol, rejec) => {
							_this.qqmapsdk.direction({
								mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
								//from参数不填默认当前地址
								...line,
								success: function(res) {
									var ret = res;
									var coors = ret.result.routes[0]
										.polyline,
										pl = [];
									//坐标解压（返回的点串坐标，通过前向差分进行压缩）
									var kr = 1000000;
									for (var i = 2; i < coors
										.length; i++) {
										coors[i] = Number(coors[i - 2]) +
											Number(coors[i]) / kr;
									}
									//将解压后的坐标放入点串数组pl中
									for (var i = 0; i < coors.length; i +=
										2) {
										pl.push({
											latitude: coors[i],
											longitude: coors[i + 1]
										})
									}
									//设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
									// _this.latitude = pl[0].latitude
									// _this.longitude = pl[0].longitude

									resol(pl)
								},
								fail: function(error) {
									console.error(error);
								},
								complete: function(res) {
									// setTimeout(() => {
									// 	resolve()
									// }, 500)

								}
							});
						}))

					})
					Promise.all(pmr).then(ress => {
						console.log(ress.length)
						movealong = [{
							points: ress[0],
							color: '#007AFF',
							width: 8,
							arrowLine: true,
						}]
						let endd = [{
							points: ress[0],
							color: '#007AFF',
							width: 8,
							arrowLine: true,
						}]
						if (ress[1]) {
							endd.push({
								points: ress[1],
								color: 'rgba(175,175,175,1)',
								width: 8,
								// arrowLine: true,
							})
						}
						resolve(endd)
					})


				})
				let flag = uni.getSystemInfoSync().platform == 'ios'
				//缩放视图
				let MapContext = wx.createMapContext("map");
				console.log([{
						latitude: _this.latitude,
						longitude: _this.longitude
					},
					{
						..._this.end_point
					}
				])

				// console.log(this.polyline)
				this.covers = marker_arr
				this.getPoiAround()
				// setTimeout(() => {
				// 	MapContext.includePoints({
				// 		points: [{
				// 				latitude: _this.latitude,
				// 				longitude: _this.longitude
				// 			},
				// 			{
				// 				..._this.end_point
				// 			}
				// 		],
				// 		padding: [flag ? 160 : 260,
				// 			(_this.data.receive.area.address_components.city.length - 3) * 12,
				// 			flag ? 160 :
				// 			240, (
				// 				_this.data.send.area.address_components.city.length - 3) * 12
				// 		],
				// 		success: (e) => {
				// 			console.log(e)
				// 		},
				// 		fail: (e) => {
				// 			console.log(e)
				// 		}
				// 	})
				// }, 2000)



				//应用标记
				uni.hideLoading()
				//运行轨迹防抖
				if (this.data.progress && e.status != "sign") {
					let newPolyLine = []
					let points = movealong[0].points
					let points_index = Math.floor(points.length / 20)
					console.log(points.length, points_index)
					for (let i = 0; i < points.length; i++) {
						if (!(i % points_index) || i == 0 || i == points.length - 1) {
							newPolyLine.push(points[i])
						}
					}

					setTimeout(() => {
						MapContext.moveAlong({
							markerId: 2,
							autoRotate: true,
							path: newPolyLine,
							// autoRotate: true,
							duration: 2000,
							success: (e) => {
								console.log("ok", e)
							},
							fail: (e) => {
								console.log("nok", e)
							}
						})
					}, 500)
				}




			},
			trim: function(value) {
				return value ? value.toString().replace(/(^\s*)|(\s*$)/g, "") : value;
			},
			showInput() {
				this.inputShowed = true
			},
			hideInput() {
				this.inputVal = "";
				this.inputShowed = false;
				uni.hideKeyboard(); //强行隐藏键盘
			},
			clearInput() {
				this.inputVal = ""
			},
			inputTyping: function(e) {
				this.inputVal = e.detail.value
			},
			getLocation(callback) {
				//当前位置
				const that = this;
				//H5：使用坐标类型为 gcj02 时，需要配置腾讯地图 sdk 信息（manifest.json -> h5）
				uni.getLocation({
					type: 'gcj02',
					altitude: true,
					success(res) {
						console.log(res)
						// that.latitude = res.latitude;
						// that.longitude = res.longitude;
						callback(res);
					},
					fail(res) {
						console.log(res)
						callback();
					}
				});
			},
			calculateDistance(to, callback) {
				console.log(to)
				let _this = this
				// let url=`https://apis.map.qq.com/ws/distance/v1/?mode=walking&to=&output=jsonp&key=W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP&from=39.901403%2C116.406243`;
				this.qqmapsdk.calculateDistance({
					from: {
						latitude: _this.latitude,
						longitude: _this.longitude
					},
					to: to,
					success: res => {
						console.log(res)
						callback && callback(res.result);
					},
					fail: res => {
						console.log(res)
						callback && callback(false);
					}
				});
			},
			handleAddress(obj) {
				if (!obj || !obj.area) return;
				console.log(obj.area)
				let text = obj.area.address_components ? obj.area.address_components.city : ""
				if (text.length > 4) {
					if (obj.city && obj.city.result && obj.city.result.length) {
						let min_index = 1
						let min_value = 3
						for (let i = 0; i < obj.city.result.length; i++) {
							if (obj.city.result[i].text.length < min_value) {
								min_index = i;
								min_value = obj.city.result[i].text.length
							}
						}
						text = obj.city.result[min_index].text
					} else {
						text = obj.address.slice(0, 4)
					}

				}
				return text


			},
			formatDate(time) {
				if (time) {
					let val = utils.formatDate("y-m-d h:i:s", new Date(time), 4, true);
					return val
				} else {
					return ""
				}
			},
			getResult(data) {
				let arr = [];
				let addr = [];
				// let idx = this.address.length;
				let _this = this
				this.calculateDistance(data, d => {
					if (d) {
						let distanceArr = d.elements || [];
						var dis = []
						for (let i = 0, len = data.length; i < len; i++) {
							data[i].distance = distanceArr[i].distance;
							dis.push(distanceArr[i].distance)
						}
						// let MapContext = uni.createMapContext("#map");
						// MapContext.moveToLocation(d[0])
						var zoom = 10,
							distance;
						distance = dis[0] - 0;
						distance = distance <= 0 ? 0 : distance;
						if (distance <= 300) {
							zoom = 17
						} else if (distance > 300 && distance <= 500) {
							zoom = 16
						} else if (distance > 500 && distance <= 1000) {
							zoom = 15
						} else if (distance > 1000 && distance <= 5000) {
							zoom = 13
						} else if (distance > 5000 && distance <= 10000) {
							zoom = 12
						} else if (distance > 10000 && distance <= 50000) {
							zoom = 10
						} else if (distance > 50000 && distance <= 100000) {
							zoom = 8
						} else if (distance > 100000 && distance <= 200000) {
							zoom = 6
						} else {
							zoom = 4
						}

						zoom = zoom - 3
						_this.scale = zoom
						// zoom = zoom - 6
						console.log(zoom)
						console.log("scale", _this.scale)
					}

					// console.log(data)

				});

				// for (let [index, item] of data.entries()) {
				// 	arr.push({
				// 		id: index + idx,
				// 		latitude: item.location.lat,
				// 		longitude: item.location.lng,
				// 		title: item.title,
				// 		iconPath: "/static/images/maps/location.png",
				// 		width: 40,
				// 		height: 40
				// 	});
				// 	let tel = this.trim(item.tel);
				// 	if (~tel.indexOf(';')) {
				// 		tel = tel.split(';')[0];
				// 	}
				// 	addr.push({
				// 		id: index + idx,
				// 		latitude: item.location.lat,
				// 		longitude: item.location.lng,
				// 		title: item.title,
				// 		address: item.address,
				// 		tel: tel,
				// 		distance: item._distance
				// 	});
				// }
				// this.address = this.address.concat(addr);
				// this.covers = this.covers.concat(arr);
				// this.pageIndex++;
				// this.loading = false;
				// if (data.length < 10) {
				// 	this.pullUpOn = false;
				// }
			},
			pullUp() {
				if (!this.pullUpOn || this.loading) return;
				this.loading = true;
				this.getPoiAround(this.keywords)
			},
			getPoiAround(keywords) {
				let _this = this
				let boundary = `reverseGeocoder(${this.end_point})`;
				// #ifdef H5
				//https://lbs.qq.com/service/webService/webServiceGuide/webServiceSearch
				let url =
					`https://apis.map.qq.com/ws/place/v1/search?keyword=${keywords}&boundary=${boundary}&page_size=1&page_index=${this.pageIndex}&output=jsonp&key=${this.key}`;
				this.tui.tuiJsonp(
					url,
					res => {
						console.log("到这了2", res)
						if (res.status === 0) {
							let data = res.data || [];
							this.getResult(data)
						}
					},
					'QQmap'
				);
				// #endif
				// this.qqmapsdk.getCityList({
				// 	success: (e) => {
				// 		console.log(e)
				// 	}
				// })

				// #ifndef H5
				this.qqmapsdk.reverseGeocoder({
					location: this.end_point,
					success: function(res) {
						_this.end_result = res.result
						_this.covers = [res.result]
						_this.getResult([res.result])
						console.log("result", res.result)
						let MapContext = uni.createMapContext("map");
						let d = {
							longitude: (_this.longitude + res.result.location.lng) / 2,
							latitude: (_this.latitude + res.result.location.lat) / 2
						}
						let e = {
							longitude: (res.result.location.lng),
							latitude: (res.result.location.lat)
						}
						let points = [{
									latitude: _this.latitude,
									longitude: _this.longitude
								}]
						if(isNaN(e.longitude)||isNaN(e.latitude)){
							
						}else{
							points.push(e)
						}
						setTimeout(() => {
							MapContext.includePoints({
								points,
								padding: [150,
									(_this.data.receive.area.address_components.city
										.length - 3) * 12,
									40, (
										_this.data.send.area.address_components.city
										.length - 3) * 12
								]

							})
							// MapContext.moveToLocation({
							// 	...d
							// })
						}, 200)

						console.log("d", d)
						// MapContext.moveToLocation({
						// 	...d,
						// 	complete: (e) => {
						// 		console.log(e)
						// 	}
						// })
					},
					fail: function(res) {
						console.log(res);
					},
					complete: function(res) {
						console.log(res);
					}
				});
				// this.qqmapsdk.search({
				// 	keyword: keywords,
				// 	page_index: this.pageIndex,
				// 	page_size: 1,
				// 	boundary: boundary,
				// 	//无此参数
				// 	location: {
				// 		latitude: this.latitude,
				// 		longitude: this.longitude
				// 	},
				// 	success: res => {
				// 		console.log("到这了",res)
				// 		let data = res.data || [];
				// 		this.getResult(data)
				// 	},
				// 	fail: res => {
				// 		this.loading = false;
				// 		this.tui.toast('获取位置信息失败，请检查是否打开位置权限');
				// 	}

				// });
				// #endif
			},
			bindInput: function(e) {
				this.keywords = e.detail.value;
				this.pageIndex = 1;
				this.address = [];
				this.covers = [];
				this.pullUpOn = true;
				this.getPoiAround(this.keywords);
			},
			marker: function(e) {
				const that = this
				const item = that.address[e.detail.markerId || 0];
				const menu = item.tel ? ["打电话", "到这里"] : ["到这里"];

				uni.showActionSheet({
					itemList: menu,
					success(res) {
						if (res.tapIndex == 0 && item.tel) {
							uni.makePhoneCall({
								phoneNumber: item.tel
							})
						} else {
							const latitude = Number(item.latitude)
							const longitude = Number(item.longitude)
							uni.openLocation({
								name: item.title,
								address: item.address,
								latitude,
								longitude,
								scale: 18
							})
						}
					},
					fail(res) {
						console.log(res.errMsg)
					}
				})

			},
			call(event) {
				const index = Number(event.currentTarget.dataset.id);
				const tel = this.address[index].tel;
				if (tel) {
					uni.makePhoneCall({
						phoneNumber: tel
					})
				}

			},
			judgeStatus(data) {
				if (data.status === 'submit') {
					return {
						text: "待揽收"
					}
				} else if (data.status === 'send') {
					return {
						text: "已揽收"
					}
				} else if (data.status === 'transport') {
					return {
						text: "运送中"
					}
				} else if (data.status === 'delivery') {
					return {
						text: "派送中"
					}
				} else if (data.status === 'sign') {
					return {
						text: "已签收"
					}
				} else {
					return {}
				}
			},
			go(event) {
				const index = Number(event.currentTarget.dataset.id)
				const item = this.address[index];
				const latitude = Number(item.latitude)
				const longitude = Number(item.longitude)
				uni.openLocation({
					name: item.title,
					address: item.address,
					latitude,
					longitude,
					scale: 18
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.from,
	.to {
		width: 220rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.address {
			font-size: 34rpx;
			font-weight: bold;
		}

		.name {
			font-size: 22rpx;
			color: #888;
		}
	}

	.tui-list {
		background-color: #fff;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 30rpx;
	}

	.tui-cell-last::after {
		border-bottom: 0;
	}

	.maps-container {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0rpx;
		right: 0;
		// overflow: hidden;
	}

	.tui-map {
		width: 750rpx;
		height: 900rpx
	}

	.scrollView {
		width: 100%;
		padding-bottom: 100rpx;
		background-color: #fff;
	}

	.search-bar {
		position: relative;
		padding: 8px 10px;
		display: -webkit-flex;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		background-color: #fff;
	}

	.icon-search {
		margin-right: 8px;
	}

	.icon-search-in-box {
		margin-right: 8rpx;
	}

	.search-bar-form {
		position: relative;
		-webkit-box-flex: 1;
		-webkit-flex: auto;
		flex: auto;
		border-radius: 5px;
		background-color: #f0f0f0;
	}

	.search-bar-text {
		display: inline-block;
		font-size: 14px;
		vertical-align: middle;
	}

	.search-bar-box {
		width: 100%;
		height: 30px;
		padding-left: 10px;
		padding-right: 30px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		position: relative;
		z-index: 1;

	}

	.search-bar-input {
		font-size: 14px;
		flex: 1;
	}

	.icon-clear {
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		padding: 0 8px;
		font-size: 0;
		display: flex;
		align-items: center;
	}

	.search-bar-label {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		border-radius: 3px;
		text-align: center;
		color: #9b9b9b;
		background: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.flex {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.cancel-btn {
		margin-left: 10px;
		line-height: 30px;
		color: #5982fd;
		white-space: nowrap;
		font-size: 15px;
	}

	.tui-list-cell {
		display: initial;
		padding: 30rpx;
	}

	.addr-title {
		font-size: 30rpx;
		line-height: 40rpx;
		color: #000;
		font-weight: bold;
		width: 100%;
		padding-bottom: 20rpx;
	}

	.addr-box {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.addr-detail {
		width: 450rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		/* autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		font-size: 24rpx;
		color: #999;
	}

	.distance {
		color: #5677fc;
		padding-right: 6rpx;
	}

	.addr-opera {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.opera-box {
		text-align: center;
		margin-left: 26rpx;
	}

	.mini-img {
		width: 44rpx;
		height: 44rpx;
	}

	.text {
		color: #333;
		font-size: 24rpx;
		line-height: 30rpx;
	}

	.image-box {
		padding: 12rpx 24rpx;
		width: 96rpx;
		flex-direction: column;
		background-color: #9cc6ff;
		border-radius: 12rpx;
		position: absolute;
		left: 24rpx;
		top: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999999;
		opacity: .9;
	}

	.movable {
		width: 750rpx;
		height: 750px;
		position: absolute;
		left: 0;
		right: 0;
		z-index: 99999;

		display: flex;
		align-items: center;

	}

	.status-bar {
		height: 124rpx;
		width: 524rpx;
		background-color: #fff;
		border-radius: 12rpx;
		position: absolute;
		right: 24rpx;
		top: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999999;
	}

	.movable-area {
		margin-top: 6px;
		width: 750rpx;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		border: 1rpx solid #eee;
		height: 650px;
		background-color: #fff;

	}

	.status {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.arrow {
			width: 100rpx;
			height: 33rpx;
		}

		.status-content {
			font-size: 22rpx;
			color: #999;
		}
	}
</style>
