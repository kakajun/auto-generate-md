const builder = require('./builder.js')
try {
  builder()
  console.log('打包完毕!已生成bin和lib文件')
} catch (error) {
  console.log('打包失败!')
}
