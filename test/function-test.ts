
const rootPath = process.cwd().replace(/\\/g, '/')
import {
  renameFilePath,

} from '../src/commands/rename-path'
import { nodesThree } from './nodes'
import fs from 'fs-extra'
import { creatFile } from './utils'

let foldPath = rootPath + '/test/temp/myVue/myTable'
    let file = rootPath + '/test/temp/myVue/myTable/testTemplate.vue'
// const finalPath = rootPath + '/test/temp/my-vue/check-test-kable-case-inner'
    async function get() {
  try {
    fs.ensureDirSync(foldPath)
    await creatFile(file)
    await renameFilePath(nodesThree)

  } catch (error) {
    console.error(error);
  }
}
get()
