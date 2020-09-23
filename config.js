let debug = 'development'; //production生产环境  development开发环境
let host_map = {
  development: 'https://caigua.zhongjianedu.com/ztk.php/',
  production: 'https://party.keji01.com',
}
let host = host_map[debug];
let api=host;

let config = {
  appid: 'wx1f74ec95280b2c1d',
  api: api,
}
module.exports = config;