const config = require('../config');
const util  = require('../utils/util');
const Services = {
    //用户授权登录 
    getUserInfoLogin(data, jiamiData){
        return util._post(`${config.api}/TkWeChatLogin/getUserInfo`,data, jiamiData, 2)
    },

    //项目列表
    getAllXmList(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/getAllXm`,data, jiamiData, 2)
    },

    //首页科目列表
    getkmlb(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/kmlb`,data, jiamiData, 2)
    },

    //试卷列表
    sortdt(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/sortdt`,data, jiamiData, 2)
    },

    //进入试卷答题首页
    sjztsy(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/sjztsy`,data, jiamiData, 2)
    },

    //进入答题
    lxmsdt(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/lxmsdt`,data, jiamiData, 2)
    },
}
module.exports = Services;