// pages/answerPage/answerPage.js
const Service = require("../../Services/services")
const app = getApp();
// import Dialog from '../../vant/dialog/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isListHave: false,
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
    danXuanLists: [], //单选存的数据
    duoXuanLists: [], //多选加材料存的数据
    current: 0, //初始显示页下标
    // 值为0禁止切换动画
    swiperDuration: 100,
    currentIndex: 0,

    answerTextValue: "", //材料题 用户输入答案

    setInterTimes: null, //定时器赋值
    second: 0, // 秒
    timeShow: false, //定时器弹窗
    dtyysj: 0, //答题已用时间

  },

  //收藏事件
  collectClick(e) {
    let type = e.currentTarget.dataset.type
    if (this.data.timeList.tx == 5 || this.data.timeList.tx == 0) {

    } else {
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
    }

  },

  //选题接口
  selectTopic(topicXh) {
    let dataLists = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      xl_id: this.data.lxmsdtList.xl_id,
      xh: topicXh
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      shijuan_id: this.data.shijuan_id,
      xl_id: this.data.lxmsdtList.xl_id,
      xh: topicXh
    }
    Service.cxxt(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        this.transformShape(res.list)
        let listL = []
        listL.push(res.list)
        let array = this.data.questionList
        if (res.list.tx == 1) {
          for (let index = 0; index < array.length; index++) {
            if (index == res.list.xh) {
              //这个是 请求到相同数据时，进行数据替换， 以后如有不需要，可以遮掉
              var deletedtodo = 'questionList[' + index + ']';
              this.setData({
                [deletedtodo]: res.list,
              })
              listL = []
            }
          }
        } else if (res.list.tx == 2 || res.list.tx == 3) {
          for (let index = 0; index < array.length; index++) {
            if (index - 1 == res.list.xh) {
              //这个是 请求到相同数据时，进行数据替换， 以后如有不需要，可以遮掉
              let inXuhao = index
              var deletedtodo = 'questionList[' + inXuhao + ']';
              this.setData({
                [deletedtodo]: res.list,
              })
              listL = []
            }
          }
        }
        this.setData({
          // timeList: res.list,
          questionList: this.data.questionList.concat(listL)
        })
        if (this.data.timeListIndex == res.list.xh) {
          this.setData({
            timeList: res.list,
            timeListIndex: ''
          })
        }
        // this.fenLiData()
        this.getThreeItemList(this.data.timeList)
        // //console.log("滑数据", this.data.questionList)
        // //console.log("当前页数据", this.data.timeList)
      }
    })
  },

  /**
   * 获取swiperList中current上一个的index
   */
  getLastSwiperChangeIndex: function (current) {
    const START = 0
    const END = 2
    // //console.log("上一个index", current)
    return current > START ? current - 1 : END
  },
  /**
   * 获取swiperLit中current下一个的index
   */
  getNextSwiperChangeIndex: function (current) {
    const START = 0
    const END = 2
    // //console.log("下一个index", current)
    return current < END ? current + 1 : START
  },
  /**
   * 获取上一个要替换的list中的item
   */
  getLastSwiperNeedItem: function (currentItem, list) {
    // //console.log("上一个", currentItem)
    let zongList = this.data.questionList
    let defaultIndex = zongList.indexOf(currentItem)
    // //console.log(defaultIndex)
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
    ////console.log(defaultIndex)
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
    ////console.log("总数", zongList)
    //console.log("当前", newList)
    if (newList.tx == 0 || newList.tx == 5) {
      defaultIndex = zongList.indexOf(newList)
    } else {
      for (let index = 0; index < zongList.length; index++) {
        if (zongList[index].id == newList.id) {
          defaultIndex = index
        }
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
      // current: current
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


  //总数据添加封面，分为单选题封面、多选题封面
  fenLiData(list) {
    let fenQuestionList = this.data.questionList
    let lxmsdtListLength = list.dtk.xuhao.danxuan.length
    let duoListLength = list.dtk.xuhao.duoxuan.length
    let topItem = {
      tx: 0
    }
    let duoItem = {
      tx: 5
    }
    for (let index = 0; index < fenQuestionList.length; index++) {
      if (fenQuestionList[0].tx != 0) {
        fenQuestionList.unshift(topItem)
        this.setData({
          questionList: fenQuestionList
        })
      } else if (duoListLength != '' && fenQuestionList[lxmsdtListLength + 1].tx != 5) {
        fenQuestionList.splice(lxmsdtListLength + 1, 0, duoItem)
        this.setData({
          questionList: fenQuestionList
        })
      }
    }
    // //console.log("添加单封页", this.data.questionList)
  },


  //总数据this.data.questionList 进行处理， 当滑动切换时使用
  disposeAllList(detail) {
    // let allList = this.data.questionList
    let allList = this.data.threeItemList
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
    let current = e.detail.current
    let currentIndex = that.data.currentIndex
    let zongList = that.data.questionList
    let currentItem = zongList[current]
    // //console.log("上一个index", currentIndex)
    // //console.log("滑动时", current)
    // //console.log("滑动时当前", that.data.timeList)

    // 如果是滑到了左边界，弹回去
    //console.log("currentItem.isFirstPlaceholder", that.data.timeList)
    if (that.data.timeList.isFirstPlaceholder) {
      that.setData({
        current: currentIndex
      })
      return
    }

    // 如果滑到了右边界，弹回去
    if (that.data.timeList.isLastPlaceholder) {
      that.setData({
        current: currentIndex,
        show: true
      })
      return
    }

    if (e.detail.source === 'touch') {
      that.setData({
        currentIndex: current,
        current: current
      })
    }

    const START = 0
    const END = 2
    // 正向滑动，到下一个的时候
    let isLoopPositive = current == START && currentIndex == END
    //console.log(isLoopPositive)
    if (current - currentIndex == 1 || isLoopPositive) {
      let topicXh = this.data.timeList.xh * 1 + 1
      that.getThreeItemList(that.data.timeList)
      if (that.data.timeList.tx != 0 && that.data.timeList.tx != 5) {
        that.selectTopic(topicXh)
      }
      // let swiperChangeItem = "threeItemList[" + that.getNextSwiperChangeIndex(current) + "]"
      // that.setData({
      //   [swiperChangeItem]: that.getNextSwiperNeedItem(currentItem, that.data.list)
      // })
    }
    // 反向滑动，到上一个的时候
    var isLoopNegative = current == END && currentIndex == START
    if (currentIndex - current == 1 || isLoopNegative) {
      let topicXh = this.data.timeList.xh * 1
      that.getThreeItemList(that.data.timeList)
      if (that.data.timeList.tx != 0 && that.data.timeList.tx != 5) {
        that.selectTopic(topicXh - 1)
      }
      // let swiperChangeItem = "threeItemList[" + that.getLastSwiperChangeIndex(current) + "]"
      // that.setData({
      //   [swiperChangeItem]: that.getLastSwiperNeedItem(currentItem, that.data.list)
      // })
    }

    // }


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
    // //console.log("当前数据", this.data.timeList)
    // //console.log("第一条初始数据", this.data.lxmsdtList)
    // //console.log("总数据", this.data.questionList)
    if (this.data.timeList.tx == 5 || this.data.timeList.tx == 0) {

    } else {
      this.setData({
        xhShow: true
      })
    }
  },

  //点击序号跳转到那一选项
  goToXuhao(e) {
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let danXuanXu = this.data.lxmsdtList.dtk.xuhao.danxuan.length
    //console.log(index)
    this.setData({
      threeItemList: []
    })
    if (index <= danXuanXu) {
      let xuhao = index
      this.selectTopic(xuhao)
      this.setData({
        timeListIndex: index,
      })
      //console.log(this.data.timeList)
      this.selectTopic(xuhao - 1)
      this.selectTopic(xuhao + 1)
      this.setData({
        current: xuhao % 3,
        xhShow: false,
      })
    } else {
      //console.log("多")
      let xuhao = index - 1
      this.selectTopic(xuhao)
      this.setData({
        timeListIndex: xuhao,
      })
      //console.log(this.data.timeList)
      this.selectTopic(xuhao - 1)
      this.selectTopic(xuhao + 1)
      this.setData({
        current: index % 3,
        xhShow: false,
      })
    }
    // this.setData({
    //   swiperDuration:1000
    // })

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
    let item = e.currentTarget.dataset.item
    let itemId = e.currentTarget.dataset.item.id

    let id = e.currentTarget.dataset.id
    // if (this.data.danXuanid != id) {
    this.setData({
      questionList: this.data.questionList,
      danXuanid: id,
      nowClickList: e.currentTarget.dataset.item
    })
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
    //console.log("点击多选", this.data.timeList)
    let itemId = e.currentTarget.dataset.item.id
    let id = e.currentTarget.dataset.id
    let udaList = []

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
    this.getThreeItemList(this.data.timeList)
    //console.log(this.data.questionList)
  },

  //多选确认答案
  quRenAnswer(e) {
    let item = e.currentTarget.dataset.item
    let da = item.da
    let uda = item.uda
    for (let u = 0; u < uda.length; u++) {
      if (da.indexOf(uda[u]) != -1) {
        if (uda.length == da.length) {
          //console.log("全对")
          this.setData({
            danDuiOrCuo: "对",
            danFenZhi: 2,
            danAnswerValue: item.uda
          })
        } else {
          //console.log("少选的")
          this.setData({
            danDuiOrCuo: "对",
            danFenZhi: uda.length * 0.5,
            danAnswerValue: item.uda
          })
        }
      } else {
        //console.log("多选错的")
        this.setData({
          danDuiOrCuo: "错",
          danFenZhi: 0,
          danAnswerValue: item.uda
        })
        break
        // return
      }
    }
    this.saveAnswerMessage(item)
  },

  //材料题填写答案输入框
  bindTextAreaBlur: function (e) {

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
    this.getThreeItemList(this.data.timeList)
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
    var that = this
    let sendList = item
    let nowTime = that.data.second - that.data.danWhenTiem
    // let sendList = this.data.nowClickList
    let dataLists = {
      cache_key: that.data.cacheKey,
      shijuan_id: that.data.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      st_id: sendList.id,
      tx: sendList.tx,
      da: that.data.danAnswerValue,
      dc: that.data.danDuiOrCuo,
      df: that.data.danFenZhi,
      ys: nowTime,
      tzt: 1,
    }
    let jiamiData = {
      cache_key: that.data.cacheKey,
      shijuan_id: that.data.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      st_id: sendList.id,
      tx: sendList.tx,
      da: that.data.danAnswerValue,
      dc: that.data.danDuiOrCuo,
      df: that.data.danFenZhi,
      ys: nowTime,
      tzt: 1,
    }
    Service.csbcdt(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        that.setData({
          danWhenTiem: that.data.second
        })
        that.selectTopic(sendList.xh)
        setTimeout(function () {
          if (sendList.xh < that.data.questionList.length - 2) {
            if (sendList.xh <= that.data.lxmsdtList.dtk.xuhao.danxuan.length + 1) {
              //console.log("跳", that.data.currentIndex)
              that.setData({
                current: that.getNextSwiperChangeIndex(that.data.currentIndex)
              })
              that.selectTopic(sendList.xh * 1 + 1)

            } else {
              //console.log("跳2", that.data.currentIndex)
              that.setData({
                current: that.getNextSwiperChangeIndex(that.data.currentIndex)
              })
              that.selectTopic(sendList.xh * 1 + 2)

              // this.setData({
              //   current: this.data.currentIndex + 1
              // })

            }
          } else {
            that.setData({
              show: true
            })
          }
        }, 300);


      }

    })
  },

  //点击右下角 交卷图标，打开弹窗
  handInPaper() {
    if (this.data.timeList.tx == 5 || this.data.timeList.tx == 0) {

    } else {
      this.setData({
        show: true
      })
    }
  },

  //点击交卷弹窗确认事件
  getUserInfo(event) {
    let sendList = this.data.timeList
    let jjztList = {
      shijuan_id: this.data.shijuan_id,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      ys: this.data.second * 1 + this.data.dtyysj * 1,
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
    wx.showLoading({
      title: '加载中...',
    })
    Service.lxmsdt(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        this.transformShape(res.list)
        this.setInterval()
        let linshiList = []
        for (let i = 0; i < res.list.ztnum; i++) {
          let item = {}
          linshiList.push(item)
        }
        this.setData({
          questionList: linshiList
        })
        this.fenLiData(res.list)
        let listL = []
        listL.push(res.list)
        let array = this.data.questionList
        if (res.list.tx == 1) {
          for (let index = 0; index < array.length; index++) {
            if (index == res.list.xh) {
              //这个是 请求到相同数据时，进行数据替换， 以后如有不需要，可以遮掉
              var deletedtodo = 'questionList[' + index + ']';
              this.setData({
                [deletedtodo]: res.list,
              })
              listL = []
            }

          }
        } else if (res.list.tx == 2 || res.list.tx == 3) {
          for (let index = 0; index < array.length; index++) {
            if (index - 1 == res.list.xh) {
              //这个是 请求到相同数据时，进行数据替换， 以后如有不需要，可以遮掉
              let inXuhao = index
              var deletedtodo = 'questionList[' + inXuhao + ']';
              this.setData({
                [deletedtodo]: res.list,
              })
              listL = []
            }
          }
        }

        this.setData({
          lxmsdtList: res.list,
          timeList: res.list.xh == 1 ? this.data.questionList[0] : res.list,
          xhlist: res.list.xhlist,
          questionList: this.data.questionList,
          dtyysj: res.list.dtyysj,
          isListHave: true
        })

        let current = res.list.xh * 1 == 1 ? 0 : res.list.xh * 1
        if (res.list.tx == 1) {
          this.setData({
            // current: res.list.xh == 1 ? 0 : res.list.xh * 1,
            current: current % 3
          })
        } else if (res.list.tx == 2 || res.list.tx == 3) {
          current = current % 3
          this.setData({
            // current: res.list.xh * 1 + 1,
            current: current + 1 % 3
          })
        }

        this.getThreeItemList(res.list)

        //console.log(this.data.questionList)
        // //console.log(this.data.xhlist)
        app.globalData.questionList = this.data.xhlist
        this.selectTopic(res.list.xh * 1 + 1)
        if (res.list.xh * 1 - 1 != 0) {
          this.selectTopic(res.list.xh * 1 - 1)
        }
        wx.hideLoading();
      }
    })
  },

  //退出时交卷子
  quitSubmit() {
    let sendList = this.data.timeList
    let dataLists = {
      cache_key: this.data.cacheKey,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      ys: this.data.second * 1 + this.data.dtyysj * 1,
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      xl_id: sendList.xl_id,
      xh: sendList.xh,
      ys: this.data.second * 1 + this.data.dtyysj * 1,
    }
    Service.tcbc(dataLists, jiamiData).then(res => {
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

  //查看大图
  clickImg(e) {
    let item = e.currentTarget.dataset.item
    wx.previewImage({
      urls: item.pic, //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
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