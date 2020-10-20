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
    active: null,
    sixActive: "全部",
    sortdtList: [], //试卷列表
    cacheKey: "", //唯一标识
    oldlists: [], //老数据
    isInit: false,
    isInitList:false,
    total: 0,
  },

  //跳到错题页面
  goToAnswerGrade(e) {
    let sendList = e.currentTarget.dataset.item
    //console.log(sendList)
    let jjztList = {
      shijuan_id: sendList.sj_id,
      xl_id: sendList.xl_id,
      type: 1
    }
    wx.setStorage({
      key: "jjztList",
      data: jjztList
    })
    wx.navigateTo({
      url: '/pages/wrongDetails/wrongDetails',
    })
  },

  //获得首页科目列表
  getkmlbList() {
    //console.log("this.data.AllXmId", this.data.AllXmId)
    let dataLists = {
      xmlb_id: this.data.AllXmId
    }
    let jiamiData = {
      xmlb_id: this.data.AllXmId
    }
    Service.getkmlb(dataLists, jiamiData).then(res => {
      //console.log(res)
      if (res.event == 100) {
        this.setData({
          kmlbList: res.list,
          kmlbListFirst:res.list[0].id,
          active:res.list[0].id == '' ? 0 : res.list[0].id,
          sjlxList: res.sjlx
        })
        this.getSortdtList();
      }
    })
  },

  //tabs切换
  onChangeSubject(event) {
    //console.log(event.detail)
    this.setData({
      kmlbListFirst: event.detail.name,
      page: 1,
      oldlists: []
    })
    this.getSortdtList();
  },

  //获得试卷列表数据
  getSortdtList() {
    //console.log(this.data.active)
    let dataLists = {
      cache_key: this.data.cacheKey,
      xmlb_id: this.data.AllXmId,
      kmlb: this.data.kmlbListFirst == 0 ? '' : this.data.kmlbListFirst,
      page: this.data.page
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      xmlb_id: this.data.AllXmId,
      kmlb: this.data.kmlbListFirst == 0 ? '' : this.data.kmlbListFirst,
      page: this.data.page
    }
    wx.showLoading({
      title: '数据加载中...',
    })
    Service.ctbst(dataLists, jiamiData).then(res => {
      //console.log(res)
      if (res.event == 100) {
        //获取上次加载的数据
        var oldlists = this.data.oldlists;
        //console.log(oldlists)
        var newlists = oldlists.concat(res.list) //合并数据 res.data 你的数组数据
        this.setData({
          sortdtList: newlists,
          total: res.total,
          isInit:true
        })
        //console.log(res.list != '')
        //console.log(res.list != null)
        if (res.list != '') {
          this.setData({
            isInitList: true
          })
        }else{
          this.setData({
            isInitList: false
          })
        }
        wx.hideLoading();
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    var that = this;
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        //console.log(res.data)
        that.setData({
          cacheKey: res.data
        })
      }
    })
    wx.getStorage({
      key: 'AllXmItem',
      success(res) {
        //console.log(res.data)
        that.setData({
          AllXmId: res.data.id,
          AllXmName: res.data.lb,
        })
        that.getkmlbList();
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
    //console.log("加载更多")
    if (this.data.sortdtList.length < this.data.total) {
      var page = this.data.page
      page++
      this.setData({
        oldlists: this.data.sortdtList,
        page: page
      })
      this.getSortdtList()
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'none',
        duration: 2000
      });

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})