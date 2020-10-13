// pages/answerPage/answerPage.js
const Service = require("../../Services/services")
const app = getApp();
// import Dialog from '../../vant/dialog/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyLists: ["A", "B", "C", "D", "E", "F", "G"],
    shijuan_id: "", //试卷id
    cacheKey: "", //用户cacheKey
    jjztList: {},
    lxmsdtList: {}, //试题内容 初始化的第一条数据
    timeList: {}, //临时数据 当前数据
    questionList: [], //循环用的数组 全局使用的
    xhlist: [], //序号列表
    type: 1, //试题类型：1-练习; 2-考试
    danXuanid: null, //单选时，存的选择中的下标数据id
    topicXh: "", //题目的序号，用于查询上下题的序号
    nowClickList: {}, //点击答案时获得的当前页的数据
    danAnswerValue: '', //单选时的答案 需要转换为 A B C 
    danDuiOrCuo: "", //单选时 确定答案的对与错
    danFenZhi: "", // 单选时 答案的得分
    danWhenTiem: 1000, //单选答题的用时

    moreValue: [], //多选时，选中的值
    xhShow: false, //序号弹窗
    show: false, //交卷弹窗
    //
    questionListDuo: [], //多选存的数据
    current: 0, //初始显示页下标
    // 值为0禁止切换动画
    swiperDuration: 600,
    currentIndex: 0,
    isJieXiShow: 1, //判断是否点击 查看解析 1为初始无， 2为查看解析

  },

  //查看大图
  clickImg(e) {
    let item = e.currentTarget.dataset.item
    console.log("图片", item)
    wx.previewImage({
      urls: item.pic, //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  //收藏事件
  collectClick(e) {
    let type = e.currentTarget.dataset.type
    let sendList = this.data.timeList
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.jjztList.shijuan_id,
      st_id: sendList.id,
      lb_id: sendList.lb_id,
      kmlb: sendList.kmlb,
      tx: sendList.tx,
      sczt: type,
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.jjztList.shijuan_id,
      st_id: sendList.id,
      lb_id: sendList.lb_id,
      kmlb: sendList.kmlb,
      tx: sendList.tx,
      sczt: type
    }
    Service.scst(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        this.selectTopic(sendList.xh)
        var sczt = 'timeList.sczt';
        if (res.msg == "取消收藏") {
          this.setData({
            [sczt]: 0
          })
        } else if (res.msg == "收藏成功") {
          this.setData({
            [sczt]: 1
          })
        }
      }
    })
  },
  //选题接口
  selectTopic(topicXh) {
    let sendList = this.data.jjztList
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id,
      xh: topicXh
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id,
      xh: topicXh
    }
    Service.cxxt(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.transformShape(res.list)
        let listL = []
        listL.push(res.list)
        // let array = this.data.questionList
        let array = this.data.errorSerialNum
        for (let index = 0; index < array.length; index++) {
          if (array[index] == res.list.xh) {
            //这个是 请求到相同数据时，进行数据替换， 以后如有不需要，可以遮掉
            var deletedtodo = 'questionList[' + index + ']';
            this.setData({
              [deletedtodo]: res.list,
            })
            listL = []
          }
        }
        console.log("listl", listL)
        this.setData({
          // timeList: res.list,
          questionList: this.data.questionList.concat(listL)
        })
        console.log("滑数据", this.data.questionList)
        console.log("当前页数据", this.data.timeList)
      }
    })
  },

  //总数据this.data.questionList 进行处理， 当滑动切换时使用
  disposeAllList(detail) {
    // let detail = this.data.current
    let allList = this.data.questionList
    for (const index in allList) {
      var timeList = allList[detail]
      this.setData({
        timeList: timeList
      })
    }
    console.log(this.data.timeList)
  },


  swiperChange(e) {
    let that = this
    console.log(e.detail)
    that.disposeAllList(e.detail.current)
    // console.log(that.data.current)
    let current = e.detail.current
    let nextSeriaNum = that.getSerialNum(current)
    let topSeriaNum = that.getSerialNumTop(current)
    console.log('下一个序号', nextSeriaNum)
    console.log(that.data.timeList)
    if (current > that.data.current && current > 0) {
      console.log(that.data.currentIndex)
      console.log("大于")
      let topicXh = nextSeriaNum
      that.selectTopic(topicXh)
      // if (e.detail.source === 'touch') {
      //   that.setData({
      //     currentIndex: topicXh,
      //     current: topicXh
      //   })
      // }
    }
    if (current < that.data.current) {
      console.log("小于")
      let topicXh = topSeriaNum
      that.selectTopic(topicXh)
      // if (e.detail.source === 'touch') {
      //   that.setData({
      //     currentIndex: topicXh - 1,
      //     current: topicXh - 1
      //   })
      // }
    }
    if (e.detail.source === 'touch') {
      that.setData({
        currentIndex: current,
        current: current
      })
    }


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

  //打开序号弹窗
  onClickAnswerCard: function (e) {
    console.log("当前数据", this.data.timeList)
    console.log("第一条初始数据", this.data.lxmsdtList)
    console.log("总数据", this.data.questionList)
    this.setData({
      xhShow: true
    })
  },

  //点击序号跳转到那一选项
  goToXuhao(e) {
    let item = e.currentTarget.dataset.item
    let array = this.data.errorSerialNum
    console.log(item)
    if (item.dct == '错') {
      for (let index = 0; index < array.length; index++) {
        if (item.xh == array[index]) {
          console.log(index, array[index])
          this.selectTopic(item.xh)
          this.selectTopic(array[index - 1])
          this.selectTopic(array[index + 1])
          this.setData({
            current: index,
            xhShow: false
          })
        }
      }
    }
  },

  //关闭序号弹窗
  onXhshowClose() {
    this.setData({
      xhShow: false
    });
  },

  //将选项0：选项一 ，序号转为 A：选项一形式
  transformShape(item) {
    let stxx = item.stxx;
    let obj = []
    item['ziuda'] = ''
    for (const key in stxx) {
      var zanli = {}
      zanli['name'] = stxx[key]
      zanli['id'] = this.data.keyLists[key]
      zanli['isType'] = false
      obj.push(zanli)
    }
    item.stxx = obj
    return item
  },


  //点击右下角 交卷图标，打开弹窗
  handInPaper() {
    this.setData({
      show: true
    })
  },

  //关闭弹窗
  onClose() {
    this.setData({
      close: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // console.log(options.shijuan_id);
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
        that.setData({
          cacheKey: res.data
        })
      }
    })
    wx.getStorage({
      key: 'jjztList',
      success(res) {
        that.setData({
          jjztList: res.data
        })
        that.getErrorsList();
      }
    })
  },

  //获取错题数据
  getErrorsList() {
    let sendList = this.data.jjztList
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id
    }
    Service.chakanct(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        this.transformShape(res.list.stxinxi)
        let linshiList = []
        for (let i = 0; i < res.list.datika.cuonum; i++) {
          let item = {}
          linshiList.push(item)
        }
        this.setData({
          questionList: linshiList
        })
        let listL = []
        listL.push(res.list.stxinxi)
        let array = this.data.questionList
        for (let index = 0; index < array.length; index++) {
          if (index + 1 == res.list.stxinxi.xh) {
            //这个是 请求到相同数据时，进行数据替换， 以后如有不需要，可以遮掉
            var deletedtodo = 'questionList[' + index + ']';
            this.setData({
              [deletedtodo]: res.list.stxinxi,
            })
            listL = []
          }
        }
        this.setData({
          lxmsdtList: res.list,
          timeList: res.list.stxinxi,
          xhlist: res.list.datika.qbxhlist,
          questionList: this.data.questionList,
          errorSerialNum: res.list.datika.ctxhlist,
          current: res.list.stxinxi.xh * 1 - 1
        })
        let nextSeriaNum = this.getSerialNum(0)
        console.log('总数据', this.data.questionList)
        console.log('下一个序号', nextSeriaNum)
        app.globalData.questionList = this.data.xhlist
        this.selectTopic(nextSeriaNum)
      }
    })
  },

  //序号取值，从错题序号列表里取下一个
  getSerialNum(value) {
    console.log("错题序号数组", this.data.errorSerialNum)
    console.log("错题小标", value)
    let current = value + 1
    console.log("下一个", this.data.errorSerialNum[current])
    return this.data.errorSerialNum[current]
  },

  //序号取值，从错题序号列表里取上一个
  getSerialNumTop(value) {
    console.log("错题序号数组", this.data.errorSerialNum)
    console.log("错题小标", value)
    let current = value - 1
    console.log("下一个", this.data.errorSerialNum[current])
    return this.data.errorSerialNum[current]
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