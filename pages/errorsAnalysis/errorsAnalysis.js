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
    swiperDuration: "250",
    currentIndex: 0,
    isJieXiShow: 1, //判断是否点击 查看解析 1为初始无， 2为查看解析
    answerTextValue: "", //材料题 用户输入答案

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
    Service.jjdtk(dataLists, jiamiData).then(res => {
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
        this.setData({
          // timeList: res.list,
          questionList: this.data.questionList.concat(listL)
        })
        // console.log("滑数据", this.data.questionList)
        // console.log("当前页数据", this.data.timeList)
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
  },


  swiperChange(e) {
    let that = this
    that.disposeAllList(e.detail.current)
    // console.log(that.data.current)
    let current = e.detail.current
    if (current > that.data.current && current > 0) {
      let topicXh = this.data.timeList.xh * 1 + 1
      that.selectTopic(topicXh)
    }
    if (current < that.data.current) {
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
    // console.log("当前数据", this.data.timeList)
    // console.log("第一条初始数据", this.data.lxmsdtList)
    // console.log("总数据", this.data.questionList)
    this.setData({
      xhShow: true
    })
  },

  //点击序号跳转到那一选项
  goToXuhao(e) {
    let index = e.currentTarget.dataset.index
    let xuhao = index + 1
    this.selectTopic(xuhao)
    this.selectTopic(xuhao - 1)
    this.selectTopic(xuhao + 1)
    this.setData({
      current: xuhao - 1,
      xhShow: false
    })
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
        that.getLxmsdtList();
      }
    })
  },

  //获得试题内容
  getLxmsdtList() {
    let sendList = this.data.jjztList
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: sendList.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh
    }
    Service.jjdtk(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        this.transformShape(res.list)
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
        let xdtkXuuhao = res.list.dtk.xuhao
        var xuHaoList = xdtkXuuhao.danxuan.concat(xdtkXuuhao.duoxuan, xdtkXuuhao.cailiao)
        this.setData({
          lxmsdtList: res.list,
          timeList: res.list,
          xhlist: res.list.xhlist,
          questionList: this.data.questionList,
          current: res.list.xh * 1 - 1,
          xuHaoList:xuHaoList
        })
        console.log("序号集合",this.data.xuHaoList)
        app.globalData.questionList = this.data.xhlist
        this.selectTopic(res.list.xh * 1 + 1)
        this.selectTopic(res.list.xh * 1 - 1)
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