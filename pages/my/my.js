//index.js
//获取应用实例
const app = getApp()
const Service = require("../../Services/services")
const MD5 = require("../../utils/md5.js")

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userDataList: null, //后台返的用户数据
    cache_key: null
  },
  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '/pages/my/my'
    // })
  },

  //跳转到 我的编辑资料页面
  goToCompileMy() {
    wx.navigateTo({
      url: '/pages/compileMy/compileMy'
    })
  },

  onShow: function () {
    console.log(111)
    var that = this
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        console.log(res)
        that.setData({
          cache_key: res.data
        })
        that.getMySjTotal(res.data)
      }
    })
    wx.getStorage({
      key: 'userDataList',
      success(res) {
        console.log(res)
        that.setData({
          userDataList: res.data
        })
      },
      fail(res) {
        console.log(res)
        that.setData({
          userDataList: null
        })
      }
    })
    console.log(222)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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

  onLoad: function () {

  },
  getUserInfo: function (e) {
    console.log(e)
    console.log(app.globalData.code)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    let dataLists = {
      code: app.globalData.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    }
    let jiamiData = {
      code: app.globalData.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    }
    Service.getUserInfoLogin(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.getMySjTotal(res.data.cache_key)
        this.setData({
          userDataList: res.data.userInfo
        })
        wx.setStorage({
          key: "cache_key",
          data: res.data.cache_key
        })
        wx.setStorage({
          key: "userDataList",
          data: res.data.userInfo
        })
        // wx.redirectTo({
        //   url: '/pages/selectStudyItem/selectStudyItem'
        // })
        // Toast[res.Flag?'success':'fail'](res.Content);
      }
    })
  },

  //获得我的统计试卷
  getMySjTotal(cacheKey) {
    let dataLists = {
      cache_key: cacheKey,
    }
    let jiamiData = {
      cache_key: cacheKey,
    }
    Service.mySjTotal(dataLists, jiamiData).then(res => {
      console.log(res)
      this.setData({
        leijiNum: res
      })
    })
  },

  //跳转到历史记录页面
  goToHistory() {
    wx.navigateTo({
      url: '/pages/historyList/historyList',
    })
  },

  //跳转到错题本页面
  goToWrongTopic() {
    wx.navigateTo({
      url: '/pages/wrongTopic/wrongTopic',
    })
  },

  //跳转到错题本页面
  goToCollect() {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  }
})