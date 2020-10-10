// pages/compileMy/compileMy.js
const Service = require("../../Services/services")
const MD5 = require('../../utils/md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cacheKey: "",
    avatar:'',
    nickname:'',
    avatar:'',
    show:false,
    value:'',
  },

  afterRead(event) {
    let that = this
    const file = event.detail.file;

    let jiamiData = {
      cache_key: that.data.cacheKey,
    }

    const suffix = "zhongjianedu";
    let timestamp = new Date().getTime();
    // 签名串
    var obj = {};
    obj["timestamp"] = timestamp;

    for (var key in jiamiData) {
      var reg = /\[(.+?)\]/;
      if (key.match(reg)) {
        obj[RegExp.$1] = jiamiData[key];
      } else {
        obj[key] = jiamiData[key];
      }
    }
    const reverse_key = Object.keys(obj).sort();
    let resource_code =
      reverse_key
      .reduce((rst, v) => (rst += `${v}=${obj[v]}&`), "")
      .slice(0, -1) + suffix;
    let sign = MD5.hexMD5(resource_code);
    console.log(resource_code)
    console.log(sign)

    wx.uploadFile({
      url: 'https://caigua.zhongjianedu.com/ztk.php/TkWeChatLogin/UpHeardImage', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'uploadfile',
      formData: {
        'cache_key': that.data.cacheKey,
        'timestamp': timestamp,
        'sign': sign,
      },
      success(res) {
        // 上传完成需要更新 fileList
        console.log(res)
        let data = JSON.parse(res.data)
        console.log(data)
        that.setData({
          avatar:data.user_pic
        })
        that.xiuUpUserInfo()
      },
      fail(error) {
        console.log(error)
      }
    });

  },

  //修改昵称头像
  xiuUpUserInfo() {
    let dataLists = {
      cache_key: this.data.cacheKey,
      nickname: this.data.nickname,
      avatar: this.data.avatar,
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
      nickname: this.data.nickname,
      avatar: this.data.avatar,
    }
    Service.upUserInfo(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        });
        wx.setStorage({
          key: "userDataList",
          data: res.data
        })
        this.setData({
          userDataList: res.data
        })
      }
    })
  },

  //跳转修改名字页面
  goToAlterName() {
    this.setData({
      show:true
    })
  },

  //输入框的值
  onChange(event) {
    console.log(event.detail);
    this.setData({
      alterNameValue:event.detail
    })
  },

  //确认按钮事件
  getUserInfo(event) {
    console.log(event.detail);
    this.setData({
      nickname:this.data.alterNameValue
    })
    this.xiuUpUserInfo()
    this.onClose()
  },

  //关闭弹窗
  onClose() {
    this.setData({ show: false });
  },

  //退出登录
  logOut() {
    let dataLists = {
      cache_key: this.data.cacheKey,
    }
    let jiamiData = {
      cache_key: this.data.cacheKey,
    }
    Service.logOut(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        wx.removeStorage({
          key: 'userDataList',
          success(res) {
            console.log(res)
          }
        })
        wx.removeStorage({
          key: 'AllXmItem',
          success(res) {
            console.log(res)
          }
        })
        wx.removeStorage({
          key: 'cache_key',
          success(res) {
            console.log(res)
          }
        })
        wx.switchTab({
          url: '/pages/my/my'
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        console.log(res.data)
        that.setData({
          cacheKey: res.data
        })
      }
    })
    wx.getStorage({
      key: 'userDataList',
      success(res) {
        console.log(res.data)
        that.setData({
          userDataList: res.data
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})