const config = require('../config');
const util  = require('../utils/util');
const Services = {
    //用户授权登录 
    getUserInfoLogin(data, jiamiData){
        return util._post(`${config.api}/TkWeChatLogin/getUserInfo`,data, jiamiData, 2)
    },
}
module.exports = Services;