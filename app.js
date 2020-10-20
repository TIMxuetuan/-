//app.js
const Service = require("./Services/services")

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //跳首页
          wx.switchTab({
            url: '/pages/index/index'
          })
          // 已经授权，可以直接调用 登录
          wx.login({
            success: res => {
              console.log(res)
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              let code = res.code
              this.globalData.code = res.code
              wx.getUserInfo({
                success: res => {
                  let dataLists = {
                    code: code,
                    // encryptedData: res.encryptedData,
                    // iv: res.iv,
                  }
                  let jiamiData = {
                    code: code,
                    // encryptedData: res.encryptedData,
                    // iv: res.iv,
                  }
                  Service.getOpenId(dataLists, jiamiData).then(res => {
                    console.log(res)
                    if (res.event == 100) {
                      wx.setStorage({
                        key: "cache_key",
                        data: res.data.cache_key
                      })
                      wx.setStorage({
                        key: "userDataList",
                        data: res.data.userInfo
                      })
                      wx.setStorage({
                        key: "isTypeThree",
                        data: 2
                      })
                      //跳首页
                      wx.switchTab({
                        url: '/pages/index/index'
                      })
                    } else if (res.event == 106) {
                      wx.setStorage({
                        key: "cache_key",
                        data: []
                      })
                      wx.setStorage({
                        key: "userDataList",
                        data: []
                      })
                      wx.setStorage({
                        key: "isTypeThree",
                        data: 1
                      })
                    }
                  })
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          })

        } else {
          //跳选择项目
          wx.reLaunch({
            url: '/pages/selectStudyItem/selectStudyItem'
          })
        }
      },
      fail: error => {}
    })
  },
  globalData: {
    userInfo: null,
    code: null,
    userDataList: null,

  }
})