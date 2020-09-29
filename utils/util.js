const MD5 = require('./md5');


let _promise = function (api) {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params);
    });
  }
}

let ajax = function (obj) {
  let _success = obj.success;
  delete obj.success;

  let session_id = wx.getStorageSync('PHPSESSID') || '';

  let header = typeof obj.header == 'undefined' ? {} : obj.header;
  if (session_id != "" && session_id != null) {
    header.Cookie = 'PHPSESSID=' + session_id;
  }
  //header.appid = config.appid;
  //header.uid = wx.getStorageSync('openid') || '';
  //header.signature = wx.getStorageSync('signature') || '';
  //header.signaturetime = wx.getStorageSync('signaturetime') || '';
  obj.header = header;

  obj.complete = function (res) {
    console.log("res", res)
    if (res.data.event == 105) {
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      });
      wx.removeStorage({
        key: 'userDataList',
        success(res) {
          console.log(res)
        }
      })
      wx.switchTab({
        url: '/pages/my/my'
      })
    }

    if (typeof res.data == 'string' && res.data.indexOf('Warning') > 0) {
      if (config.debug) {
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 2000
        });
      }
    }
  };

  return new Promise((resolve, reject) => {
    wx.request(Object.assign({}, {
      success: function (response) {
        _success(response)
        resolve(response.data, response)
      },
      fail: function (err) {
        reject(err.errMsg, err)
        console.log('fail', err.errMsg)
      }
    }, obj));
  });
}

const getConfig = (isjson, params, jiamiData, level) => {
  const suffix = "zhongjianedu";
  console.log(isjson, params, level, jiamiData)
  let config_ = {
    headers: {
      // level
    }
  };
  // 时间戳
  if (level === 1) {
    params = {
      encrypt: MD5(JSON.stringify(params))
    }; // 加密
  } else if (level === 2) {
    //注意：登陆时用户信息需要加密，所以拼接在签名中；后续接口参数不需要加密，就不需要拼接如签名
    // 签名
    let timestamp = new Date().getTime();
    console.log("时间戳", timestamp)
    // 获取token
    let token = wx.getStorageSync("communityToken") || "";
    // 签名串
    var obj = {};
    // var paramsData = {};

    obj["timestamp"] = timestamp;
    if (token != "") {
      obj["token"] = token || "";
    }

    for (var key in jiamiData) {
      var reg = /\[(.+?)\]/;
      if (key.match(reg)) {
        obj[RegExp.$1] = jiamiData[key];
      } else {
        obj[key] = jiamiData[key];
      }
    }

    //sort key
    const reverse_key = Object.keys(obj).sort();
    let resource_code =
      reverse_key
      .reduce((rst, v) => (rst += `${v}=${obj[v]}&`), "")
      .slice(0, -1) + suffix;
    let sign = MD5.hexMD5(resource_code);
    console.log("resource_code", resource_code);

    // let sign = signClick(token, timestamp, params);
    console.log("communityToken", token);
    // config_.headers = {
    //   token,
    //   timestamp,
    //   sign
    // };
    params["timestamp"] = timestamp;
    params["sign"] = sign;
    // params["token"] = token;
    // console.log("params", params);
  }

  // 表单提交参数
  // if (!isjson) {
  //   // console.log("isjson", isjson);
  //   config_.headers["Content-Type"] = "application/x-www-form-urlencoded";
  //   config_.responseType = "text";
  //   config_.transformRequest = [
  //     function (data) {
  //       return param2String(data);
  //     }
  //   ];
  // }
  // // 设置参数
  // if (method in { get: true, delete: true }) {
  //   config_.params = params;
  // } else if (method in { post: true, put: true }) {
  //   config_.data = params;
  // }
  return params;
};

let _get = function (url, obj, message = '') {
  wx.showNavigationBarLoading()
  if (!message && typeof message === "string") {
    wx.showLoading({
      title: message,
    })
  }

  return ajax({
    method: 'GET',
    header: {
      'cache-control': 'no-cache'
    },
    url: url,
    data: obj,
    dataType: 'json',
    success: function (response) {
      let res = response.data;
      if (res.title && typeof res.title != 'undefined') {
        wx.setNavigationBarTitle({
          title: res.title
        });
      }

      wx.hideNavigationBarLoading()
      if (!message && typeof message === "string") {
        wx.hideLoading()
      }
    }
  })
}

let _post = function (url, params, jiamiData, level, message = '') {
  // wx.showNavigationBarLoading();
  if (!message && typeof message === "string") {
    // wx.showLoading({
    //   title: message,
    // })
  }
  // let dataParams = getConfig(params, jiamiData)
  let dataParams = getConfig("false", params, jiamiData, level)
  console.log(jiamiData)
  return ajax({
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    },
    url: url,
    data: dataParams,
    dataType: 'json',
    success: function (response) {
      let res = response.data;
      wx.hideNavigationBarLoading()
      if (!message && typeof message === "string") {
        wx.hideLoading()
      }
    }
  })
}


//
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  ajax: ajax,
  _get: _get,
  _post: _post,
}