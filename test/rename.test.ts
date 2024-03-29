import { foldNode, fileNode, nodesTwo, nodesThree } from './utils/nodes-test'
import fs from 'fs-extra'
import {
  renameFilePath,
  changePathFold,
  changePathName,
  renameFoldPath,
  replaceName,
  checkCamelFile
} from '../src/commands/rename-path'
import { creatFile } from './utils/utils'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})
describe('rename.test的测试', () => {
  test('checkCamelFile --检测kebab-case', () => {
    const flag = checkCamelFile('MyTemplate.vue')
    logger.info('flag:', flag)
    expect(flag).toEqual(true)
  })

  test('changePathFold --递归修改文件夹node的path', () => {
    changePathFold(foldNode, { newName: 'check-test-kable-case', filename: 'checkTestKableCase' })
    const obj = {
      name: 'check-test-kable-case',
      isDir: true,
      level: 1,
      note: '',
      copyed: false,
      imports: [],
      belongTo: [],
      fullPath: rootPath + '/temp/check-test-kable-case',
      children: [
        {
          name: 'check-test-kable-caseInner',
          isDir: true,
          level: 1,
          note: '',
          copyed: false,
          imports: [],
          belongTo: [],
          fullPath: rootPath + '/temp/check-test-kable-case/checkTestKableCaseInner'
        }
      ]
    }
    const str = JSON.stringify(obj)
    expect(JSON.stringify(foldNode)).toEqual(str)
  })

  test('changePathName --递归修改文件里面的import', () => {
    changePathName(fileNode, { newName: 'you-template', filename: 'youTemplate' })
    // logger.info('tempNode', JSON.stringify(fileNode))
    const finalObj = {
      name: 'you-template',
      isDir: false,
      level: 2,
      note: ' // 我就是个注释',
      imports: [rootPath.toLowerCase() + '/temp/my-template.vue'],
      belongTo: [],
      size: 96,
      copyed: false,
      rowSize: 4,
      suffix: '.vue',
      fullPath: rootPath + '/temp/TestKableCase/you-template.vue'
    }
    expect(fileNode).toMatchObject(finalObj)
  })

  test('replaceName --改文件名', (done) => {
    const foldPath2 = rootPath + '/temp/checkTestKableCase2'
    const file = rootPath + '/temp/checkTestKableCase2/testTemplate.vue'
    async function get() {
      try {
        fs.ensureDirSync(foldPath2)
        await creatFile(file)
        await replaceName(foldPath2)
        const flag = fs.existsSync(rootPath + '/temp/check-test-kable-case2')
        expect(flag).toEqual(true)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })

  test('renameFoldPath --改所有文件夹名', (done) => {
    // 自备独立测试数据
    const foldPath = rootPath + '/temp/TestKableCase'
    const file = rootPath + '/temp/TestKableCase/youTemplate.vue'
    const file2 = rootPath + '/temp/test-kable-case/youTemplate.vue'
    const foldPath2 = rootPath + '/temp/TestKableCase/TestKableCase2'
    const finalPath = rootPath + '/temp/test-kable-case'
    async function get() {
      try {
        fs.ensureDirSync(foldPath)
        fs.ensureDirSync(foldPath2)
        await creatFile(file)
        await renameFoldPath(nodesTwo)
        const flag = fs.existsSync(finalPath)
        const flag2 = fs.existsSync(file2)
        expect(flag && flag2).toEqual(true)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })

  test('renameFoldPath --改所有文件名', (done) => {
    // 自备独立测试数据
    const foldPath = rootPath + '/temp/myVue/myTable'
    const file = rootPath + '/temp/myVue/myTable/testTemplate.vue'
    const finalPath = rootPath + '/temp/myVue/myTable/test-template.vue'
    async function get() {
      try {
        fs.ensureDirSync(foldPath)
        await creatFile(file)
        await renameFilePath(nodesThree)
        const flag = fs.existsSync(finalPath)
        expect(flag).toEqual(true)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })
})
