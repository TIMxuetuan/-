// pages/historyList/historyList.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AllXmId: "",
    AllXmName: "",
    page: 1,
    kmlbList: [], //科目列表
    sjlxList: [], //试卷类型
    active: 0,
    sixActive: "全部",
    sortdtList: [], //试卷列表
    cacheKey: "", //唯一标识
  },

  //获得首页科目列表
  getkmlbList() {
    console.log("this.data.AllXmId", this.data.AllXmId)
    let dataLists = {
      xmlb_id: this.data.AllXmId
    }
    let jiamiData = {
      xmlb_id: this.data.AllXmId
    }
    Service.getkmlb(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.setData({
          kmlbList: res.list,
          sjlxList: res.sjlx
        })
      }
    })
  },

  //tabs切换
  onChangeSubject(event) {
    console.log(event.detail)
    this.setData({
      active: event.detail.name
    })
    this.getSortdtList();
  },

  //获得试卷列表数据
  getSortdtList() {
    console.log(this.data.active)
    let dataLists = {
      cache_key: this.data.cacheKey,
      xmlb_id: this.data.AllXmId,
      kmlb: this.data.active == 0 ? '' : this.data.active,
      page: this.data.page
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      xmlb_id: this.data.AllXmId,
      kmlb: this.data.active == 0 ? '' : this.data.active,
      page: this.data.page
    }
    Service.zt_lsjl(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.setData({
          sortdtList: res.list
        })
      }
    })
  },

  //跳到全部解析页面
  goToAnswerGrade(e) {
    let sendList = e.currentTarget.dataset.item
    console.log(sendList)
    let jjztList = {
      shijuan_id: sendList.sj_id,
      xl_id: sendList.id,
      xh: sendList.dyxh,
      // ys: 2000,
    }
    wx.setStorage({
      key: "jjztList",
      data: jjztList
    })
    wx.navigateTo({
      url: '/pages/errorsAnalysis/errorsAnalysis',
    })
    // wx.navigateTo({
    //   url: '/pages/answerGrade/answerGrade',
    // })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        console.log(res.data)
        that.setData({
          cacheKey: res.data
        })
      }
    })
    wx.getStorage({
      key: 'AllXmItem',
      success(res) {
        console.log(res.data)
        that.setData({
          AllXmId: res.data.id,
          AllXmName: res.data.lb,
        })
        that.getkmlbList();
        that.getSortdtList();
      }
    });

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