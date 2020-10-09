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
    lxmsdtList: {}, //试题内容
    xhlist: [], //序号列表
    type: 2, //试题类型：1-练习; 2-考试
    timeList: {}, //临时数据
    danXuanid: null, //单选时，存的选择中的下标数据id
    topicXh: "", //题目的序号，用于查询上下题的序号
    nowClickList: {}, //点击答案时获得的当前页的数据
    danAnswerValue: '', //单选时的答案 需要转换为 A B C 
    danDuiOrCuo: "", //单选时 确定答案的对与错
    danFenZhi: "", // 单选时 答案的得分
    danWhenTiem: 0, //单选答题的用时

    moreValue: [], //多选时，选中的值
    xhShow: false, //序号弹窗
    show: false, //交卷弹窗
    //
    questionList: [], //循环用的数组
    questionListDuo: [], //多选存的数据
    current: 0, //初始显示页下标
    // 值为0禁止切换动画
    swiperDuration: "250",
    currentIndex: 0,

    answerTextValue: "", //材料题 用户输入答案

    setInterTimes: null, //定时器赋值
    second: 0, // 秒
    timeShow: false, //定时器弹窗

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
        } else if (res.msg == "收藏成功") {
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
        this.transformShape(res.list)
        let listL = []
        listL.push(res.list)
        let array = this.data.questionList
        for (let index = 0; index < array.length; index++) {
          if (index + 1 == res.list.xh) {
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
        // this.disposeAllList()
        console.log("滑数据", this.data.questionList)
        console.log("当前页数据", this.data.timeList)
        // console.log(this.data.questionListDuo)
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
    let index = e.currentTarget.dataset.index
    console.log(index)
    let xuhao = index + 1
    this.selectTopic(xuhao)
    this.selectTopic(xuhao - 1)
    this.selectTopic(xuhao + 1)
    this.setData({
      current: xuhao - 1,
      xhShow: false
    })
  },

  //坐上交卷，弹出交卷弹窗，并关闭选项弹窗
  youJiaojuan() {
    this.setData({
      xhShow: false,
      show: true
    })
  },

  //关闭序号弹窗
  onXhshowClose() {
    this.setData({
      xhShow: false
    });
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
    let item = e.currentTarget.dataset.item
    let itemId = e.currentTarget.dataset.item.id
    console.log(e.currentTarget.dataset.stxxitem)
    console.log(e.currentTarget.dataset.id)
    console.log(this.data.danXuanid)
    let id = e.currentTarget.dataset.id
    // if (this.data.danXuanid != id) {
    this.setData({
      questionList: this.data.questionList,
      danXuanid: id,
      nowClickList: e.currentTarget.dataset.item
    })
    console.log("提交问题")
    this.data.danAnswerValue = id
    this.judgeScore(this.data.danAnswerValue)
    this.saveAnswerMessage(item)
    // } else {
    //   this.setData({
    //     danXuanid: null
    //   })
    // }
  },

  //多选点击选项
  moreSelectClick(e) {
    console.log("确认答案")
    let itemId = e.currentTarget.dataset.item.id
    let id = e.currentTarget.dataset.id
    let udaList = []

    console.log(e.currentTarget.dataset.stxxitem)
    console.log(id)
    this.data.questionList.map(item => {
      if (item.id == itemId) {
        if (item.uda.indexOf(id) == -1) {
          udaList.push(id)
          item.uda = Array.from(new Set(item.uda.concat(udaList)))
        } else {
          var arr = item.uda;
          var key = arr.indexOf(id)
          arr.splice(key, 1)
        }
        this.setData({
          moreValue: item.uda
        })
      }
    })

    this.setData({
      questionList: this.data.questionList,
      danXuanid: id,
      nowClickList: e.currentTarget.dataset.item
    })
    console.log("多选", this.data.moreValue)
    console.log(this.data.questionList)
  },

  //多选确认答案
  quRenAnswer(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    let da = item.da
    let uda = item.uda
    for (let u = 0; u < uda.length; u++) {
      if (da.indexOf(uda[u]) != -1) {
        if (uda.length == da.length) {
          console.log("全对")
          this.setData({
            danDuiOrCuo: "对",
            danFenZhi: 2,
            danAnswerValue: item.uda
          })
        } else {
          console.log("少选的")
          this.setData({
            danDuiOrCuo: "对",
            danFenZhi: uda.length * 0.5,
            danAnswerValue: item.uda
          })
        }
      } else {
        console.log("多选错的")
        this.setData({
          danDuiOrCuo: "错",
          danFenZhi: 0,
          danAnswerValue: item.uda
        })
        break
        // return
      }
    }
    console.log(this.data.danDuiOrCuo, this.data.danFenZhi, this.data.danAnswerValue)
    this.saveAnswerMessage(item)
  },

  //材料题填写答案输入框
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
    console.log(e.currentTarget.dataset.item)
    let detaValue = e.detail.value
    let itemId = e.currentTarget.dataset.item.id
    this.data.questionList.map(item => {
      if (item.id == itemId) {
        item.uda = detaValue
        this.setData({
          answerTextValue: item.uda
        })
      }
    })

    this.setData({
      questionList: this.data.questionList,
      nowClickList: e.currentTarget.dataset.item
    })
    console.log("zzz", this.data.questionList)
  },

  //材料题提交答案
  caiLiaoConfig(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      danDuiOrCuo: "待定",
      danFenZhi: 0,
      danAnswerValue: item.uda
    })
    this.saveAnswerMessage(item)
  },


  //将选项0：选项一 ，序号转为 A：选项一形式
  transformShape(item) {
    let stxx = item.stxx;
    let obj = []
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

  //保存答题试题信息,点击选项时，进行提交答题信息
  saveAnswerMessage(item) {
    console.log(this.data.nowClickList)
    console.log(item)
    let sendList = item
    let nowTime = this.data.second - this.data.danWhenTiem
    // let sendList = this.data.nowClickList
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
      ys: nowTime,
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
      ys: nowTime,
      tzt: 1,
    }
    Service.csbcdt(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.selectTopic(sendList.xh)
        this.setData({
          danWhenTiem: this.data.second
        })
        if (sendList.xh < this.data.questionList.length) {
          this.selectTopic(sendList.xh * 1 + 2)
          this.setData({
            current: sendList.xh * 1
          })
        } else {
          this.setData({
            show: true
          })
        }

      }
    })
  },

  //点击右下角 交卷图标，打开弹窗
  handInPaper() {
    this.setData({
      show: true
    })
  },

  //点击交卷弹窗确认事件
  getUserInfo(event) {
    let sendList = this.data.timeList
    console.log(sendList)
    let jjztList = {
      shijuan_id: this.data.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      ys: this.data.second,
    }
    wx.setStorage({
      key: "jjztList",
      data: jjztList
    })
    wx.redirectTo({
      url: '/pages/answerGrade/answerGrade',
    })
    this.onClose()
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
        this.transformShape(res.list)
        this.setInterval()
        console.log(res.list)
        let linshiList = []
        for (let i = 0; i < res.list.ztnum; i++) {
          let item = {}
          linshiList.push(item)
        }
        this.setData({
          questionList: linshiList
        })
        let listL = []
        listL.push(res.list)
        let array = this.data.questionList
        for (let index = 0; index < array.length; index++) {
          if (index + 1 == res.list.xh) {
            //这个是 请求到相同数据时，进行数据替换， 以后如有不需要，可以遮掉
            var deletedtodo = 'questionList[' + index + ']';
            this.setData({
              [deletedtodo]: res.list,
            })
            listL = []
          }
        }
        console.log("listl", listL)
        // let listOne = []
        // listOne.push(res.list)
        this.setData({
          lxmsdtList: res.list,
          timeList: res.list,
          xhlist: res.list.xhlist,
          questionList: this.data.questionList,
          current: res.list.xh * 1 - 1
        })
        console.log(this.data.questionList)
        console.log(this.data.xhlist)
        app.globalData.questionList = this.data.xhlist
        this.selectTopic(res.list.xh * 1 + 1)
        this.selectTopic(res.list.xh * 1 - 1)
      }
    })
  },

  //退出时交卷子
  quitSubmit() {
    console.log(this.data.timeList)
    let sendList = this.data.timeList
    let dataLists = {
      cache_key: this.data.cacheKey,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      ys: this.data.second
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      ys: this.data.second
    }
    Service.tcbc(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {}
    })
  },

  // 计时器
  setInterval: function () {
    const that = this
    var second = that.data.second
    var minute = that.data.minute
    var hours = that.data.hours
    that.data.setInterTimes = setInterval(function () { // 设置定时器
      second++
      that.setData({
        second: second
      })
    }, 1000)
  },

  //暂停计时器
  pauseTime() {
    console.log('暂停')
    this.setData({
      timeShow: true
    })
    clearInterval(this.data.setInterTimes)
  },

  getTimeServe() {
    this.setInterval()
    this.setData({
      timeShow: false
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
    console.log("退出了")
    this.quitSubmit()
    clearInterval(this.data.setInterTimes)
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