/**
 * Created by k186 on 2022/4/24.
 * Name:
 * GitHub:
 * Email: k1868548@gmail.com
 */
const Translate = require("./translate")
const originData = require('../locales/zh_CN.js')

const fs = require('fs')
const path = require('path')

const config = {
  from: 'zh',
  to: ['en', 'cht', 'pl','hkm'],
  dist: path.resolve('../locales')
}
const split = '_'

function transformData(data) {
  let keys = Object.keys(data);
  let resultKey = [];
  let resultValue = [];
  for ( let i = 0; i < keys.length; i++ ) {
    resultKey.push(keys[ i ])
    resultValue.push(data[ keys[ i ] ])
  }
  let text = resultValue.join(split);
  if (text.length > 2000) {
    console.log('翻译文本过长,请处理后再重试')
    return
  }
  loopTranslate(text, 0, resultKey)
  
}

function loopTranslate(text, index, resultKey) {
  if (index === config.to - 1) {
    return
  }
  Translate(text, {from: config.from, to: config.to[ index ]}).then(res => {
    setTimeout(() => {
      loopTranslate(text, index + 1, resultKey)
    }, 3000)
    generateFile(resultKey, res)
  }).catch(res=>{
  
  })
}

function generateFile(resultKey, res) {
  let result = res.trans_result.dst
  let suffix = res.to;
  let resultValue = result.split(split)
  let str = '';
  
  resultValue.forEach((el, index) => {
    str += `"${resultKey[ index ]}":"${resultValue[ index ]}",\n`
  })
  str = `export default { ${str} }`
  const fileName = `${res.from}_${suffix}.js`
  const url = config.dist + `/${fileName}`;
  console.log(`写入${fileName}`)
  fs.writeFileSync(url, str)
}

transformData(originData)
