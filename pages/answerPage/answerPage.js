// pages/answerPage/answerPage.js
const Service = require("../../Services/services")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shijuan_id: "", //试卷id
    cacheKey: "", //用户cacheKey
    lxmsdtList: {}, //试题内容
    xhlist: [], //序号列表
    type: 1, //试题类型：1-练习; 2-考试
    timeList: {}, //临时数据
    //
    questionList: [], //循环用的数组
    questionListDuo:[], //多选存的数据
    current: 0, //初始显示页下标
    // 值为0禁止切换动画
    swiperDuration: "250",
    currentIndex: 0

  },

  requestQuestionInfo: function () {
    let that = this
    // 模拟网络请求成功
    // let questionList = []
    // for (let i = 0; i < 2; i++) {
    //   let item = {}
    //   item.index = i
    //   item.total = 2
    //   item.img = "../../../img/kebi.jpeg"
    //   questionList.push(item)
    // }
    // 暂时全局记一下list, 答题卡页直接用了
    // app.globalData.questionList = questionList
  },

  //选题接口
  selectTopic() {
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      xl_id: this.data.timeList.xl_id,
      xh: this.data.timeList.xh * 1 + 1,
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      xl_id: this.data.timeList.xl_id,
      xh: this.data.timeList.xh * 1 + 1,
    }
    Service.cxxt(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.setData({
          timeList: res.list,
          // questionList: this.data.questionList.concat(listL)
        })
        if(res.list.tx == 1){
          let listL = []
          listL.push(res.list)
          this.setData({
            questionList: this.data.questionList.concat(listL)
          })
        }else if(res.list.tx == 2){
          let listLduo = []
          listLduo.push(res.list)
          this.setData({
            questionListDuo: this.data.questionListDuo.concat(listLduo)
          })
        }
        console.log(this.data.questionList)
        console.log(this.data.questionListDuo)
      }
    })
  },


  swiperChange(e) {
    let that = this
    console.log(e.detail)
    // console.log(that.data.current)
    let current = e.detail.current
    if (current > that.data.current) {
      console.log(this.data.currentIndex)
      console.log(this.data.questionList)
      console.log("大于")
      that.selectTopic()
    }
    that.setData({
      currentIndex: current,
      current: current
    })

    if (current == -1) {
      wx.showToast({
        title: "已经是第一题了",
        icon: "none"
      })
      return
    }

    if (current == -2) {
      wx.showModal({
        title: "提示",
        content: "您已经答完所有题，是否退出？",
      })
      return
    }
  },

  onClickAnswerCard: function (e) {
    let that = this;
    // 因为某一项不一定是在当前项的左侧还是右侧
    // 跳转前将动画去除，以免点击某选项回来后切换的体验很奇怪
    that.setData({
      swiperDuration: "0"
    })
    wx.navigateTo({
      url: '/pages/answer_card/answer_card'
    })
  },

  onClickLast: function (e) {
    let that = this
    if (that.data.currentIndex - 1 < 0) {
      return
    }
    that.setData({
      current: that.data.currentIndex - 1
    })
  },

  onClickNext: function (e) {
    let that = this
    if (that.data.currentIndex + 1 > that.data.list.length - 1) {
      return
    }
    that.setData({
      current: that.data.currentIndex + 1
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options.shijuan_id);
    that.setData({
      swiperHeight: wx.getSystemInfoSync().windowHeight,
    })
    // that.requestQuestionInfo()
    that.setData({
      shijuan_id: options.shijuan_id
    });
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        console.log(res.data)
        that.setData({
          cacheKey: res.data
        })
        that.getLxmsdtList();
      }
    })
  },

  //获得试题内容
  getLxmsdtList() {
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      type: this.data.type
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      type: this.data.type
    }
    Service.lxmsdt(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        let listOne = []
        listOne.push(res.list)
        this.setData({
          lxmsdtList: res.list,
          timeList: res.list,
          xhlist: res.list.xhlist,
          questionList: listOne
        })
        console.log(this.data.questionList)
        app.globalData.questionList = this.data.xhlist
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