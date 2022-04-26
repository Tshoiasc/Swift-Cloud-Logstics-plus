  exports.nfcRead = function(callback) {
    const nfc = wx.getNFCAdapter()
    let _this = this

    function discoverHandler(res) {
      console.log('discoverHandler', res) // 发现者
      const data = new Uint8Array(res.id)
      let str = ""
      data.forEach(e => {
        let item = e.toString(16)
        if (item.length == 1) {
          item = '0' + item
        }
        item = item.toUpperCase()
        console.log(item)
        str += item
      })
		
      console.log("卡号为：" + str)
      wx.showToast({
        title: '读取成功！',
        icon: 'none'
      })
      callback(str)
      // console.log(discoverHandler.techs);
      
    }



    nfc.startDiscovery({
      success(res) {
        console.log(res)
        wx.showToast({
          title: 'NFC读取功能已开启！',
          icon: 'none'
        })
        nfc.onDiscovered(discoverHandler)
      },
      fail(err) {
        console.log('failed to discover:', err)
        if (!err.errCode) {
          wx.showToast({
            title: '请检查NFC功能是否正常!',
            icon: 'none'
          })
          return
        }
        switch (err.errCode) {
          case 13000:
            wx.showToast({
              title: '设备不支持NFC!',
              icon: 'none'
            })
            break;
          case 13001:
            wx.showToast({
              title: '系统NFC开关未打开!',
              icon: 'none'
            })
            break;
          case 13019:
            wx.showToast({
              title: '用户未授权!',
              icon: 'none'
            })
            break;
          case 13010:
            wx.showToast({
              title: '未知错误!',
              icon: 'none'
            })
            break;
        }
      }
    })
  }