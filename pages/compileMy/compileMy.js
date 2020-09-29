// pages/compileMy/compileMy.js
const Service = require("../../Services/services")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cacheKey: ""
  },

  afterRead(event) {
    console.log(event)
    const file = event.detail.file;
    console.log(file)
    let dataLists = {
      cache_key: this.data.cacheKey,
      uploadfile: file
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      uploadfile: file
    }
    Service.UpHeardImage(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {

      }
    })
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
    //   filePath: file.path,
    //   name: 'file',
    //   formData: {
    //     user: 'test'
    //   },
    //   success(res) {
    //     console.log(res)
    //     // 上传完成需要更新 fileList
    //     const {
    //       fileList = []
    //     } = this.data;
    //     fileList.push({
    //       ...file,
    //       url: res.data
    //     });
    //     this.setData({
    //       fileList
    //     });
    //   },
    // });
  },

  //退出登录
  logOut() {
    let dataLists = {
      cache_key: this.data.cacheKey,
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
    }
    Service.logOut(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        wx.removeStorage({
          key: 'userDataList',
          success(res) {
            console.log(res)
          }
        })
        wx.removeStorage({
          key: 'AllXmItem',
          success(res) {
            console.log(res)
          }
        })
        wx.removeStorage({
          key: 'cache_key',
          success(res) {
            console.log(res)
          }
        })
        wx.switchTab({
          url: '/pages/my/my'
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        console.log(res.data)
        that.setData({
          cacheKey: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})