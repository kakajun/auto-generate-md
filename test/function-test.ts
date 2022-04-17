
const rootPath = process.cwd().replace(/\\/g, '/')
import {
  // renameFilePath,

  renameFoldPath,

} from '../src/commands/rename-path'
import {  nodesTwo } from './nodes'
import fs from 'fs-extra'
import { creatFile } from './utils'
// 自备独立测试数据
let foldPath = rootPath + '/test/temp/TestKableCase'
let file = rootPath + '/test/temp/TestKableCase/youTemplate.vue'
let foldPath1 = rootPath + '/test/temp/myVue/checkTestKableCaseInner'
// const finalPath = rootPath + '/test/temp/my-vue/check-test-kable-case-inner'
async function get() {
  try {
    fs.ensureDirSync(foldPath)
    await creatFile(file)
    fs.ensureDirSync(foldPath1)
    await renameFoldPath(nodesTwo)
//     const flag = fs.existsSync(finalPath)
//  console.log(flag);
  } catch (error) {
    console.error(error);
  }
}
get()
