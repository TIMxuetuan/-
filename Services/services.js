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

    //选择答题（上一题、下一题）
    cxxt(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/cxxt`,data, jiamiData, 2)
    },

    //保存答题试题信息
    csbcdt(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/csbcdt`,data, jiamiData, 2)
    },
    
    //交卷
    jjzt(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/jjzt`,data, jiamiData, 2)
    },



    //试题：收藏，取消收藏接口
    scst(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/scst`,data, jiamiData, 2)
    },


    //收藏试卷列表
    sczxsj(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/sczxsj`,data, jiamiData, 2)
    },

    //做题历史记录
    zt_lsjl(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/zt_lsjl`,data, jiamiData, 2)
    },

    //错题本
    ctbst(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/ctbst`,data, jiamiData, 2)
    },

    //我的-头像上传地址
    UpHeardImage(data, jiamiData){
        return util._post(`${config.api}/TkWeChatLogin/UpHeardImage`,data, jiamiData, 2)
    },

    //我的-退出登录
    logOut(data, jiamiData){
        return util._post(`${config.api}/TkWeChatLogin/logOut`,data, jiamiData, 2)
    },

    //我的-统计试卷 试题
    mySjTotal(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/mySjTotal`,data, jiamiData, 2)
    },

    //首页显示最新测试信息
    userXlInfo(data, jiamiData){
        return util._post(`${config.api}/TkWeChat/userXlInfo`,data, jiamiData, 2)
    },


}
module.exports = Services;