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
    type: 2, //试题类型：1-练习; 2-考试
    timeList: {}, //临时数据
    danXuanidx: null, //单选时，存的选择中的下标数据
    topicXh: "", //题目的序号，用于查询上下题的序号
    nowClickList: {}, //点击答案时获得的当前页的数据
    danAnswerValue: '', //单选时的答案 需要转换为 A B C 
    danDuiOrCuo: "", //单选时 确定答案的对与错
    danFenZhi: "", // 单选时 答案的得分
    danWhenTiem: 1000, //单选答题的用时
    //
    questionList: [], //循环用的数组
    questionListDuo: [], //多选存的数据
    current: 0, //初始显示页下标
    // 值为0禁止切换动画
    swiperDuration: "250",
    currentIndex: 0

  },

  //收藏事件
  collectClick(e) {
    let type = e.currentTarget.dataset.type
    console.log(type)
    console.log(this.data.timeList)
    let sendList = this.data.timeList
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      st_id: sendList.id,
      lb_id: sendList.lb_id,
      kmlb: sendList.kmlb,
      tx: sendList.tx,
      sczt: type,
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      st_id: sendList.id,
      lb_id: sendList.lb_id,
      kmlb: sendList.kmlb,
      tx: sendList.tx,
      sczt: type
    }
    Service.scst(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.selectTopic(sendList.xh)
        var sczt = 'timeList.sczt';
        if (res.msg == "取消收藏") {
          this.setData({
            [sczt]: 0
          })
        }else if(res.msg == "收藏成功"){
          this.setData({
            [sczt]: 1
          })
        }
      }
    })
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
  selectTopic(topicXh) {
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      xl_id: this.data.timeList.xl_id,
      xh: topicXh
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      xl_id: this.data.timeList.xl_id,
      xh: topicXh
    }
    Service.cxxt(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        let listL = []
        listL.push(res.list)
        let array = this.data.questionList
        for (let index = 0; index < array.length; index++) {
          if (array[index].id == res.list.id) {
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
        // if (res.list.tx == 1) {
        //   let listL = []
        //   listL.push(res.list)
        //   this.setData({
        //     questionList: this.data.questionList.concat(listL)
        //     // questionList: res.list
        //   })
        // } else if (res.list.tx == 2) {
        //   let listLduo = []
        //   listLduo.push(res.list)
        //   this.setData({
        //     questionListDuo: this.data.questionListDuo.concat(listLduo)
        //   })
        // }
        console.log("滑数据", this.data.questionList)
        console.log("当前页数据", this.data.timeList)
        // console.log(this.data.questionListDuo)
      }
    })
  },

  //总数据this.data.questionList 进行处理， 当滑动切换时使用
  disposeAllList(detail) {
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
    console.log(this.data.timeList)
    if (current > that.data.current && current > 0) {
      console.log(this.data.currentIndex)
      console.log("大于")
      let topicXh = this.data.timeList.xh * 1 + 1
      that.selectTopic(topicXh)
    }
    if (current < that.data.current) {
      console.log("小于")
      let topicXh = this.data.timeList.xh * 1
      that.selectTopic(topicXh - 1)
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

  //选择答案的下标转为 A B C D
  switchAnswier(idx) {
    if (idx == 0) {
      return 'A'
    } else if (idx == 1) {
      return 'B'
    } else if (idx == 2) {
      return 'C'
    } else if (idx == 3) {
      return 'D'
    } else if (idx == 4) {
      return 'E'
    } else if (idx == 5) {
      return 'F'
    }
  },

  //判断对错、以及得分
  judgeScore(value) {
    if (value == this.data.nowClickList.da) {
      this.setData({
        danDuiOrCuo: "对",
        danFenZhi: this.data.nowClickList.fz
      })
    } else {
      this.setData({
        danDuiOrCuo: "错",
        danFenZhi: 0
      })
    }
  },

  //单选点击事件
  radioClick(e) {
    console.log(e.currentTarget.dataset.item)
    console.log(e.currentTarget.dataset.stxxitem)
    console.log(e.currentTarget.dataset.idx)
    let idx = e.currentTarget.dataset.idx
    if (this.data.danXuanidx != idx) {
      this.setData({
        danXuanidx: idx,
        nowClickList: e.currentTarget.dataset.item
      })
      console.log("提交问题")
      this.data.danAnswerValue = this.switchAnswier(idx)
      this.judgeScore(this.data.danAnswerValue)
      this.saveAnswerMessage()
    } else {
      this.setData({
        danXuanidx: null
      })
    }
  },

  //保存答题试题信息,点击选项时，进行提交答题信息
  saveAnswerMessage() {
    console.log(this.data.danAnswerValue, this.data.danDuiOrCuo, this.data.danFenZhi)
    console.log(this.data.nowClickList)
    let sendList = this.data.nowClickList
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      st_id: sendList.id,
      tx: sendList.tx,
      da: this.data.danAnswerValue,
      dc: this.data.danDuiOrCuo,
      df: this.data.danFenZhi,
      ys: this.data.danWhenTiem,
      tzt: 1,
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      st_id: sendList.id,
      tx: sendList.tx,
      da: this.data.danAnswerValue,
      dc: this.data.danDuiOrCuo,
      df: this.data.danFenZhi,
      ys: this.data.danWhenTiem,
      tzt: 1,
    }
    Service.csbcdt(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.selectTopic(sendList.xh)
      }
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
        this.selectTopic(res.list.xh * 1 + 1)
        // this.selectTopic(res.list.xh * 1 - 1)
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