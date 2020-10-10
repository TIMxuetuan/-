// pages/answerGrade/answerGrade.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cache_key: "",
    jjztList: {}, //获得上一页的数据，用来展示交卷内容
    pageLists: {}, //用于页面展示的数据
  },

  //交卷接口
  getJjztList() {
    let sendList = this.data.jjztList
    console.log(sendList)
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
        this.setData({
          pageLists: res.list
        })
      }
    })
  },

  //点击序号，跳转到解析页面
  goToExercise(e) {
    let sendList = e.currentTarget.dataset.item
    console.log(sendList)
    let jjztList = {
      shijuan_id: sendList.sj_id,
      xl_id: sendList.id,
      xh: sendList.xh,
      ys: 2000,
    }
    wx.setStorage({
      key: "jjztList",
      data: jjztList
    })
    wx.redirectTo({
      url: '/pages/errorsAnalysis/errorsAnalysis',
    })
  },

  //全部解析
  allExercise() {
    let sendList = this.data.jjztList
    console.log(sendList)
    let jjztList = {
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      // ys: 2000,
    }
    wx.setStorage({
      key: "jjztList",
      data: jjztList
    })
    wx.navigateTo({
      url: '/pages/errorsAnalysis/errorsAnalysis',
    })
  },

  //查看错题
  goToSeeError() {
    let sendList = this.data.jjztList
    console.log(sendList)
    let jjztList = {
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      // ys: 2000,
    }
    wx.setStorage({
      key: "jjztList",
      data: jjztList
    })
    wx.navigateTo({
      url: '/pages/seeError/seeError',
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