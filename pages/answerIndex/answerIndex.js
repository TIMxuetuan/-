// pages/answerIndex/answerIndex.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shijuan_id: "", //试卷id
    shiType: "", //控制跳转到那个模式，0-练习; 1-考试 
    cacheKey: "", //用户cacheKey
    sjztsyLists: {}, //数据列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      shijuan_id: options.shijuan_id,
      shiType: options.shiType
    })
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        that.setData({
          cacheKey: res.data
        })
        that.getSjztsyList();
      }
    })
  },

  //获得试卷答题首页内容
  getSjztsyList() {
    console.log(this.data.shiType)
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      sj_type:this.data.shiType
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      sj_type:this.data.shiType
    }
    Service.sjztsy(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        this.setData({
          sjztsyLists: res.list,
          isLx:res.list.is_lx
        })
        console.log(this.data.isLx)
      }
    })
  },

  //跳转答题页面内容
  goToAnswerPage() {
    if (this.data.shiType == 0) {
      //跳转到练习模式
      wx.redirectTo({
        url: '/pages/exercisePage/exercisePage?shijuan_id=' + this.data.sjztsyLists.id,
      })
    }else if(this.data.shiType == 1){
      //跳转到考试模式
      wx.redirectTo({
        url: '/pages/answerPage/answerPage?shijuan_id=' + this.data.sjztsyLists.id,
      })
    }

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