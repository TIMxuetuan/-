// pages/selectStudyItem/selectStudyItem.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getAllXmList: [],
    selectNowId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.id)
    this.setData({
      selectNowId:options.id
    })
    this.getAllXm();
  },

  //获得学习项目列表
  getAllXm() {
    let dataLists = {}
    let jiamiData = {}
    Service.getAllXmList(dataLists, jiamiData).then(res => {
      //console.log(res)
      if (res.event == 100) {
        this.setData({
          getAllXmList: res.data
        })
      }
    })
  },

  //获得当前选中框的id
  getSelectId(data){
    //console.log(data)
    this.setData({
      selectNowId:data[0].id
    })
    //console.log(this.data.selectNowId)
  },

  //跳转首页，并传参id
  goToindex(e){
    //console.log(e.currentTarget.dataset.item)
    wx.setStorage({
      key:"AllXmItem",
      data:e.currentTarget.dataset.item
    })
    wx.switchTab({
      url: '/pages/index/index'
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
    wx.hideHomeButton()
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