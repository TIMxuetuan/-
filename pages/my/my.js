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
    cache_key: null,
    isLogin: false,
    isTypeThree: null, //1：代表用户进行手机号授权， 2：代表用户信息授权， 0：代表已登录
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
    var that = this
    wx.getStorage({
      key: 'AllXmItem',
      success(res) {
        that.setData({
          AllXmItem: res.data
        })
      }
    })
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        that.setData({
          cache_key: res.data
        })
        that.getMySjTotal(res.data)
      },
      fail(res) {
        that.setData({
          cache_key: null
        })
        that.userInfoGetOpen()
      }
    })

    wx.getStorage({
      key: 'isTypeThree',
      success(res) {
        that.setData({
          isTypeThree: res.data
        })
      }
    })
    wx.getStorage({
      key: 'userDataList',
      success(res) {
        that.setData({
          userDataList: res.data,
          isLogin: true,
          isTypeThree: 0
        })
      },
      fail(res) {
        that.setData({
          userDataList: null,
          // isTypeThree: 1
        })
      }
    })
    //   if (app.globalData.userInfo) {
    //     this.setData({
    //       userInfo: app.globalData.userInfo,
    //       hasUserInfo: true
    //     })
    //   } else if (this.data.canIUse) {
    //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //     // 所以此处加入 callback 以防止这种情况
    //     app.userInfoReadyCallback = res => {
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   } else {
    //     // 在没有 open-type=getUserInfo 版本的兼容处理
    //     wx.getUserInfo({
    //       success: res => {
    //         app.globalData.userInfo = res.userInfo
    //         this.setData({
    //           userInfo: res.userInfo,
    //           hasUserInfo: true
    //         })
    //       }
    //     })
    //   }
  },

  onLoad: function () {

  },

  //进行手机号绑定授权
  getPhoneNumber(e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        let dataLists = {
          code: code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        }
        let jiamiData = {
          code: code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        }
        Service.bindMobile(dataLists, jiamiData).then(res => {
          if (res.event == 100) {
            this.setData({
              user_phone: res.data,
              isTypeThree: 2
            })
            wx.setStorage({
              key: "user_phone",
              data: res.data
            })
          }
        })
      }
    })
  },

  //进行登录，获取用户信息
  getUserInfo: function (e) {
    console.log(e)
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        let dataLists = {
          code: code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          user_phone: this.data.user_phone
          // user_phone: '18237203633'
        }
        let jiamiData = {
          code: code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          user_phone: this.data.user_phone
          // user_phone: '18237203633'
        }
        Service.getUserInfoLogin(dataLists, jiamiData).then(res => {
          if (res.event == 100) {
            this.getMySjTotal(res.data.cache_key)
            this.setData({
              userDataList: res.data.userInfo,
              isLogin: true,
              isTypeThree: 0,
              cache_key:res.data.cache_key
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
      }
    })
  },

  //如果用户绑定了，初次登录需要授权
  userInfoGetOpen() {
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        let dataLists = {
          code: code,
        }
        let jiamiData = {
          code: code,
        }
        Service.getOpenId(dataLists, jiamiData).then(res => {
          console.log(res)
          if (res.event == 100) {
            this.setData({
              isTypeThree: 2,
              user_phone: res.data.userInfo.mobile
            })
          } else if (res.event == 106) {
            this.setData({
              isTypeThree: 1
            })
          }
        })
      }
    })
  },

  //获得我的统计试卷
  getMySjTotal(cacheKey) {
    console.log(this.data.AllXmItem)
    let dataLists = {
      cache_key: cacheKey,
      xmlb_id: this.data.AllXmItem.id
    }
    let jiamiData = {
      cache_key: cacheKey,
      xmlb_id: this.data.AllXmItem.id
    }
    Service.mySjTotal(dataLists, jiamiData).then(res => {
      this.setData({
        leijiNum: res,
      })
    })
  },

  //跳转到历史记录页面
  goToHistory() {
    console.log(this.data.cache_key)
    if (this.data.cache_key) {
      wx.navigateTo({
        url: '/pages/historyList/historyList',
      })
    } else {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      });
    }
  },

  //跳转到错题本页面
  goToWrongTopic() {
    if (this.data.cache_key) {
      wx.navigateTo({
        url: '/pages/wrongTopic/wrongTopic',
      })
    } else {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      });
    }
  },

  //跳转到错题本页面
  goToCollect() {
    if (this.data.cache_key) {
      wx.navigateTo({
        url: '/pages/collect/collect',
      })
    } else {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      });
    }
  }
})