//index.js
//获取应用实例
const app = getApp()
const Service = require("../../Services/services")
const MD5 = require("../../utils/md5.js")

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    console.log(app.globalData.code)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    let dataLists = {
      code:app.globalData.code,
      encryptedData:e.detail.encryptedData,
      iv:e.detail.iv,
    }
    let jiamiData = {
      code:app.globalData.code,
      encryptedData:e.detail.encryptedData,
      iv:e.detail.iv,
    }
    Service.getUserInfoLogin(dataLists, jiamiData).then(res=>{
      console.log(res)
      if(res.event == 100){
        wx.setStorage({
          key:"cache_key",
          data:res.data.cache_key
        })
        // wx.switchTab({
        //   url: '/pages/index/index'
        // })
        // Toast[res.Flag?'success':'fail'](res.Content);
      }
    })
  }
})
