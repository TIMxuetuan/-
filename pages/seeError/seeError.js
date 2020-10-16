// pages/answerPage/answerPage.js
const Service = require("../../Services/services")
const app = getApp();
// import Dialog from '../../vant/dialog/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInit:false,
    isListHave:false,
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
    danWhenTiem: 0, //单选答题的用时

    moreValue: [], //多选时，选中的值
    xhShow: false, //序号弹窗
    show: false, //交卷弹窗
    //
    questionListDuo: [], //多选存的数据
    current: 0, //初始显示页下标
    // 值为0禁止切换动画
    swiperDuration: 100,
    currentIndex: 0,
    isJieXiShow: 1, //判断是否点击 查看解析 1为初始无， 2为查看解析

  },

  //查看大图
  clickImg(e) {
    let item = e.currentTarget.dataset.item
    //console.log("图片", item)
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

  /**
   * 获取swiperList中current上一个的index
   */
  getLastSwiperChangeIndex: function (current) {
    const START = 0
    const END = 2
    //console.log("上一个index", current)
    return current > START ? current - 1 : END
  },
  /**
   * 获取swiperLit中current下一个的index
   */
  getNextSwiperChangeIndex: function (current) {
    const START = 0
    const END = 2
    //console.log("下一个index", current)
    return current < END ? current + 1 : START
  },
  /**
   * 获取上一个要替换的list中的item
   */
  getLastSwiperNeedItem: function (currentItem, list) {
    //console.log("上一个", currentItem)
    let zongList = this.data.questionList
    let defaultIndex = zongList.indexOf(currentItem)
    //console.log(defaultIndex)
    let listNeedIndex = defaultIndex - 1
    let item = listNeedIndex == -1 ? {
      isFirstPlaceholder: true
    } : zongList[listNeedIndex]
    return item
  },
  /**
   * 获取下一个要替换的list中的item
   */
  getNextSwiperNeedItem: function (currentItem, list) {
    //console.log("下一个", currentItem)
    let zongList = this.data.questionList
    let defaultIndex = zongList.indexOf(currentItem)
    //console.log(defaultIndex)
    let listNeedIndex = defaultIndex + 1
    let item = listNeedIndex == zongList.length ? {
      isLastPlaceholder: true
    } : zongList[listNeedIndex]
    return item
  },

  //总数据分为 封面加三个页面的数组
  getThreeItemList(newList) {
    var that = this
    var zongList = that.data.questionList
    // var newList = that.data.timeList
    var defaultIndex = ''
    //console.log("总数", zongList)
    //console.log("当前", newList)
    for (let index = 0; index < zongList.length; index++) {
      if (zongList[index].id == newList.id) {
        defaultIndex = index
      }
    }

    //console.log("defaultIndex", defaultIndex)

    let swiperList = []
    for (let i = 0; i < 3; i++) {
      swiperList.push({})
    }
    let current = defaultIndex % 3
    //console.log(current)
    that.setData({
      currentIndex: current,
      current: current
    })
    let currentItem = zongList[defaultIndex]
    swiperList[current] = currentItem
    swiperList[that.getLastSwiperChangeIndex(current)] = that.getLastSwiperNeedItem(currentItem, zongList)
    swiperList[that.getNextSwiperChangeIndex(current)] = that.getNextSwiperNeedItem(currentItem, zongList)

    that.setData({
      threeItemList: swiperList
    })
    //console.log("三个页面", that.data.threeItemList)
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
      //console.log(res)
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
        //console.log("listl", listL)
        this.setData({
          // timeList: res.list,
          questionList: this.data.questionList.concat(listL)
        })
        if (this.data.timeListIndex == res.list.xh) {
          //console.log("等于", this.data.timeListIndex, res.list)
          this.setData({
            timeList: res.list,
            timeListIndex: ''
          })
        }
        this.getThreeItemList(this.data.timeList)
        //console.log("滑数据", this.data.questionList)
        //console.log("当前页数据", this.data.timeList)
      }
    })
  },

  //总数据this.data.questionList 进行处理， 当滑动切换时使用
  disposeAllList(detail) {
    // let detail = this.data.current
    let allList = this.data.threeItemList
    for (const index in allList) {
      var timeList = allList[detail]
      this.setData({
        timeList: timeList
      })
    }
    //console.log(this.data.timeList)
  },


  swiperChange(e) {
    let that = this
    //console.log(that.data.timeList)
    that.disposeAllList(e.detail.current)
    let current = e.detail.current
    let currentIndex = that.data.currentIndex
    let zongList = that.data.questionList

    let nextCurrent = ''
    for (let index = 0; index < zongList.length; index++) {
      if (zongList[index].id == that.data.timeList.id) {
        nextCurrent = index
      }
    }

    // 如果是滑到了左边界，弹回去
    //console.log("currentItem.isFirstPlaceholder", that.data.timeList)
    if (that.data.timeList.isFirstPlaceholder) {
      that.setData({
        current: currentIndex
      })
      wx.showToast({
        title: "已经是第一题了",
        icon: "none"
      })
      return
    }

    // 如果滑到了右边界，弹回去
    if (that.data.timeList.isLastPlaceholder) {
      that.setData({
        current: currentIndex,
      })
      wx.showToast({
        title: "已经是最后一题了",
        icon: "none"
      })
      return
    }
    //console.log(current)
    if (e.detail.source === 'touch') {
      that.setData({
        currentIndex: current,
        // current: current
      })
    }


    //console.log(nextCurrent)
    let nextSeriaNum = that.getSerialNum(nextCurrent)
    let topSeriaNum = that.getSerialNumTop(nextCurrent)
    //console.log('下一个序号', nextSeriaNum)
    //console.log(that.data.timeList)

    const START = 0
    const END = 2
    // 正向滑动，到下一个的时候
    let isLoopPositive = current == START && currentIndex == END
    //console.log(isLoopPositive)
    if (current - currentIndex == 1 || isLoopPositive) {
      let topicXh = nextSeriaNum
      that.getThreeItemList(that.data.timeList)
      that.selectTopic(topicXh)
    }
    // 反向滑动，到上一个的时候
    var isLoopNegative = current == END && currentIndex == START
    if (currentIndex - current == 1 || isLoopNegative) {
      let topicXh = topSeriaNum
      that.getThreeItemList(that.data.timeList)
      that.selectTopic(topicXh)
    }
  },

  //打开序号弹窗
  onClickAnswerCard: function (e) {
    //console.log("当前数据", this.data.timeList)
    //console.log("第一条初始数据", this.data.lxmsdtList)
    //console.log("总数据", this.data.questionList)
    this.setData({
      xhShow: true
    })
  },

  //点击序号跳转到那一选项
  goToXuhao(e) {
    var that = this
    that.setData({
      threeItemList:[]
    })
    let item = e.currentTarget.dataset.item
    let array = that.data.errorSerialNum
    //console.log(item)
    if (item.dct == '错') {
      for (let index = 0; index < array.length; index++) {
        if (item.xh == array[index]) {
          //console.log(index, array[index])
          that.selectTopic(item.xh)
          that.setData({
            timeListIndex: item.xh,
          })
          that.selectTopic(array[index - 1])
          that.selectTopic(array[index + 1])
          setTimeout(function () {
            that.setData({
              current: index % 3,
              xhShow: false,
            })
          }, 100)
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
    // //console.log(options.shijuan_id);
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
    wx.showLoading({
      title: '数据加载中...',
    })
    Service.chakanct(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        wx.hideLoading();
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
        let array = res.list.datika.ctxhlist
        for (let index = 0; index < array.length; index++) {
          if (array[index] == res.list.stxinxi.xh) {
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
          isInit:true
          // current:0
        })
        if(res.list.stxinxi != '' || res.list.stxinxi != null){
          this.setData({
            isListHave:true
          })
        }else{
          this.setData({
            isListHave:false
          })
        }
        let nextSeriaNum = this.getSerialNum(0)
        //console.log('总数据', this.data.questionList)
        //console.log('下一个序号', nextSeriaNum)
        app.globalData.questionList = this.data.xhlist
        this.getThreeItemList(res.list.stxinxi)
        this.selectTopic(nextSeriaNum)
      }
    })
  },

  //序号取值，从错题序号列表里取下一个
  getSerialNum(value) {
    //console.log("错题序号数组", this.data.errorSerialNum)
    //console.log("错题小标", value)
    let current = value + 1
    //console.log("下一个", this.data.errorSerialNum[current])
    return this.data.errorSerialNum[current]
  },

  //序号取值，从错题序号列表里取上一个
  getSerialNumTop(value) {
    //console.log("错题序号数组", this.data.errorSerialNum)
    //console.log("错题小标", value)
    let current = value - 1
    //console.log("下一个", this.data.errorSerialNum[current])
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