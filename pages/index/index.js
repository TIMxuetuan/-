// pages/index/index.js
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
    oldlists: [], //老数据
    isInit: false,
    isInitFather:false,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //返回项目列表页，并传入id值
  goToSelectStudy() {
    //console.log(this.data.AllXmId)
    wx.reLaunch({
      url: '/pages/selectStudyItem/selectStudyItem?id=' + this.data.AllXmId
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
          sjlxList: res.sjlx
        })
      }
    })
  },

  //tabs切换
  onChangeSubject(event) {
    //console.log(event.detail)
    this.setData({
      active: event.detail.name,
      page: 1,
      oldlists: []
    })
    this.getSortdtList();
  },

  //六个模块选择
  onChangeSjlx(event) {
    //console.log(event)
    this.setData({
      sixActive: event.detail,
      page: 1,
      oldlists: []
    })
    this.getSortdtList();
  },

  //获得试卷列表数据
  getSortdtList() {
    console.log(this.data.active)
    let dataLists = {
      xmlb_id: this.data.AllXmId,
      cache_key: "",
      sj_lx: this.data.sixActive,
      kmlb: this.data.active == 0 ? '' : this.data.active,
      page: this.data.page
    }
    let jiamiData = {
      xmlb_id: this.data.AllXmId,
      cache_key: "",
      sj_lx: this.data.sixActive,
      kmlb: this.data.active == 0 ? '' : this.data.active,
      page: this.data.page
    }
    wx.showLoading({
      title: '加载中...',
    })
    Service.sortdt(dataLists, jiamiData).then(res => {
      //console.log(res)
      if (res.event == 100) {
        //获取上次加载的数据
        var oldlists = this.data.oldlists;
        //console.log(oldlists)
        var newlists = oldlists.concat(res.list) //合并数据 res.data 你的数组数据
        if (res.list == '') {
          this.setData({
            isInit: false
          })
        } else {
          this.setData({
            isInit: true
          })
        }
        this.setData({
          sortdtList: newlists,
          total: res.total,
          isInitFather:true
        })
        wx.hideLoading();
      } else {
        wx.hideLoading();
      }
    })
  },

  //去练习页面--进入答题
  goToExercise(e) {
    //console.log(this.data.cacheKey)
    if (this.data.cacheKey) {
      wx.navigateTo({
        url: '/pages/answerIndex/answerIndex?shijuan_id=' + e.currentTarget.dataset.item.id + '&shiType=1',
      })
    } else {
      wx.switchTab({
        url: '/pages/my/my'
      })
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      });
    }

  },

  //跳转到历史记录页面
  goToHistory() {
    if (this.data.cacheKey) {
      wx.navigateTo({
        url: '/pages/historyList/historyList',
      })
    } else {
      wx.switchTab({
        url: '/pages/my/my'
      })
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      });
    }
  },

  //跳转到错题本页面
  goToWrongTopic() {
    if (this.data.cacheKey) {
      wx.navigateTo({
        url: '/pages/wrongTopic/wrongTopic',
      })
    } else {
      wx.switchTab({
        url: '/pages/my/my'
      })
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      });
    }
  },

  //跳转到错题本页面
  goToCollect() {
    if (this.data.cacheKey) {
      wx.navigateTo({
        url: '/pages/collect/collect',
      })
    } else {
      wx.switchTab({
        url: '/pages/my/my'
      })
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      });
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
    //console.log(options)
    var that = this;
    wx.getStorage({
      key: 'AllXmItem',
      success(res) {
        //console.log(res.data)
        that.setData({
          AllXmId: res.data.id,
          AllXmName: res.data.lb,
        })
        that.getkmlbList();
        that.getSortdtList();
      }
    });
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        //console.log(res.data)
        that.setData({
          cacheKey: res.data
        })
      }
    })
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