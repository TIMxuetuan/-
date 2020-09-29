// pages/answerGrade/answerGrade.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cache_key:"",
    jjztList: {} //获得的数据，用来展示交卷内容
  },

  //交卷接口
  getJjztList() {
    let sendList = this.data.jjztList
    let dataLists = {
      cache_key: this.data.cache_key,
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      ys: sendList.ys,
    }
    let jiamiData = {
      cache_key: this.data.cache_key,
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      ys: sendList.ys,
    }
    Service.jjzt(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {

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
        console.log(res)
        that.setData({
          cache_key: res.data
        })
      }
    })
    wx.getStorage({
      key: 'jjztList',
      success(res) {
        console.log(res)
        that.setData({
          jjztList: res.data
        })
        that.getJjztList()
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