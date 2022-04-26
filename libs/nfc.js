export default {
  data () {
    return {
      adapter: null,
      errCode: {
        13000: '本设备不支持NFC',
        13001: '系统NFC开关未打开',
        13010: '未知错误',
        13019: '用户未授权',
        13021: '已经开始NFC扫描',
        13018: '尝试在未开始NFC扫描时停止NFC扫描',
        13022: '标签已经连接',
        13023: '尝试在未连接标签时断开连接',
        13013: '未扫描到NFC标签',
        13014: '无效的标签技术',
        13015: '从标签上获取对应技术失败',
        13024: '当前标签技术不支持该功能',
        13017: '相关读写操作失败',
        13016: '连接失败'
      }
    }
  },
  onLoad () {},
  methods: {
    // 按钮
    async NFCReadCard (e) {
      try {
        uni.showLoading({
          title: '请靠近 NFC 卡片'
        })

        this.adapter = wx.getNFCAdapter()
        console.log('adapter', this.adapter)

        await this._startDiscovery()
        const discovered = await this._onDiscovered()

        if (e === 0) {
          await this.NFCread(discovered)
        } else {
          await this.NFCwrite(discovered)
        }

        await this._shutDown()
        console.log('完毕------------')

        uni.showToast({
          title: '完毕',
          duration: 2000
        })
      } catch (e) {
        // TODO handle the exception
        console.log('catch-e', e)

        await this._shutDown()

        const content = this.errCode[e.errCode]
        uni.showToast({
          title: content || e.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    },

    // 开始监听
    _startDiscovery () {
      return new Promise((resolve, reject) => {
        this.adapter.startDiscovery({
          success: e => {
            console.log('开始监听贴卡', e)
            resolve()
          },
          fail: error => {
            // console.log('error', error)
            reject(error)
          }
        })
      })
    },

    // 监听
    _onDiscovered () {
      return new Promise((resolve, reject) => {
        this.adapter.onDiscovered(
          (this.onDiscoveredCallback = res => {
            console.log('读到卡片了', res)
            // console.log('卡-id', res.id)
            console.log('卡-id', this.buf2hex(res.id))

            // 调用打卡接口

            resolve(res)
          })
        )
      })
    },

    // 关闭
    _shutDown () {
      this.adapter.offDiscovered(this.onDiscoveredCallback)
      console.log('offDiscovered-关闭读')

      this.adapter.stopDiscovery()
      console.log('stopDiscovery-结束')

      uni.hideLoading()
    },

    // 读取
    NFCread (res) {
      return new Promise((resolve, reject) => {
        if (res.messages) {
          const payload = res.messages[0].records[0].payload
          console.log('payload', payload)

          const bufToString = this.arrayBufferToString(payload)
          console.log('bufToString', bufToString)
        } else {
          console.log('此卡无内容')
        }

        resolve()
      })
    },

    // 写入
    NFCwrite (res) {
      return new Promise((resolve, reject) => {
        if (res.techs.includes(this.adapter.tech.nfcA)) {
          console.log('发现' + this.adapter.tech.nfcA + '卡')
          const nfcA = this.adapter.getNfcA()

          nfcA.connect({
            success: connectRes => {
              console.log('设备已连接A', connectRes)

              // 将字符串转成 ArrayBuffer 对象
              const arrayBuffer = this.stringToArrayBuffer('123')
              console.log('arrayBuffer', arrayBuffer)

              nfcA.transceive({
                data: arrayBuffer,
                success: transceiveRes => {
                  console.log('发送数据成功, 接收数据如下:', transceiveRes)
                  resolve()
                },
                fail: function (transceiveErr) {
                  console.log('发送数据失败', transceiveErr)
                  reject(transceiveErr)
                }
              })
            },
            fail: function (connectResErr) {
              console.log('设备联接错误', connectResErr)
              reject(connectResErr)
            }
          })
        } else {
          uni.showToast({
            title: '标题',
            icon: '不支持此NFC卡',
            duration: 2000
          })
          resolve()
        }
      })
    },

    // 转16进制字符
    buf2hex (buffer) {
      // buffer is an ArrayBuffer
      return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
    },

    stringToArrayBuffer (str) {
      const buf = new ArrayBuffer(str.length)
      const bufView = new Uint8Array(buf)
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i)
      }
      return buf
    },

    arrayBufferToString (buffer) {
      const data = this.buf2hex(buffer)
      if (data.length % 2) return ''

      let tmp = ''
      for (let i = 0; i < data.length; i += 2) {
        tmp += '%' + data.charAt(i) + data.charAt(i + 1)
      }

      return decodeURI(tmp)
    }
  }
}