/**
 * Created by k186 on 2022/4/24.
 * Name:
 * GitHub:
 * Email: k1868548@gmail.com
 */
// const translate = require('baidu-translate-api');
const axios = require('axios');
const MD5 = require('md5')

const CONFIG = require('./config.js')

function translate(text, {from = 'auto', to = 'en'}) {
  let url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
  let config = {
    q: text,
    from,
    to,
    appid: CONFIG.appid,
    salt: new Date().getTime()
  }
  config.sign = MD5(`${config.appid}${text}${config.salt}${CONFIG.token}`)
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: config
    }).then(res => {
      if (res.data.error_code == undefined) {
        resolve({from: res.data.from, to: res.data.to, trans_result: res.data.trans_result[ 0 ]})
      } else {
        console.log(res.data.error_msg)
      }
    }).catch(error => {
      reject()
    })
  })
}

module.exports = translate