// pages/huoDong/huoDong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://www.zjtaoke.cn/eleven/"
  },

  getMsgFromWeb(e) {
    console.log('getMsgFromWeb', e.detail.data)
    let type = e.detail.data[0]
    console.log(type)
    this.jumpXCX(type)
  },

  onWebLoad(e) {
    console.log('onWebLoad', e)
  },

  onWebError(e) {
    console.error('onWebError', e)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(222)
    var that = this
    let phone = options.phone;
    console.log(phone)
    that.setData({
      url: 'https://www.zjtaoke.cn/eleven/?phone=' + phone + "&title=" + "1"
      // url: 'http://192.168.1.6:8080/?phone=' + phone + "&title=" + "3"
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