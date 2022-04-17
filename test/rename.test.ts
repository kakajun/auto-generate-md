import {
  foldNode,
  fileNode,
  nodesTwo
} from './nodes'
import fs from 'fs-extra'
import {
  // renameFilePath,
  changePathFold,
  changePathName,
  renameFoldPath,
  replaceName,
  checkCamelFile
} from '../src/commands/rename-path'
import { creatFile } from './utils'
import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('rename.test')
debug.enabled = true

describe('rename.test的测试', () => {
  test('checkCamelFile --检测kebab-case', () => {
    let flag = checkCamelFile('MyTemplate.vue')
    debug('flag:', flag)
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
       fullPath: rootPath + '/test/temp/check-test-kable-case',
       children: [
         {
           name: 'check-test-kable-caseInner',
           isDir: true,
           level: 1,
           note: '',
           copyed: false,
           imports: [],
           belongTo: [],
           fullPath: rootPath + '/test/temp/check-test-kable-case/checkTestKableCaseInner'
         }
       ]
     }
    const str = JSON.stringify(obj)
    expect(JSON.stringify(foldNode)).toEqual(str)
  })

    test('changePathName --递归修改文件里面的import', () => {
     changePathName(fileNode, { newName: 'you-template', filename: 'youTemplate' })
      debug('tempNode', JSON.stringify(fileNode))
      let finalObj = {
        name: 'you-template',
        isDir: false,
        level: 2,
        note: ' // 我就是个注释',
        imports: ['/test/temp/my-template.vue'],
        belongTo: [],
        size: 96,
        copyed: false,
        rowSize: 4,
        suffix: '.vue',
        fullPath: rootPath + '/test/temp/TestKableCase/you-template.vue'
      }

      expect(fileNode).toMatchObject(finalObj)
    })



  test('replaceName --改文件名', (done) => {
      let foldPath2 = rootPath + '/test/temp/checkTestKableCase2'
    async function get() {
      try {
        fs.ensureDirSync(foldPath2)

        await replaceName(foldPath2)
        const flag = fs.existsSync(rootPath + '/test/temp/check-test-kable-case2')
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
    let foldPath = rootPath + '/test/temp/TestKableCase'
    let file = rootPath + '/test/temp/TestKableCase/youTemplate.vue'
    const finalPath = rootPath + '/test/temp/test-kable-case'

    async function get() {
      try {
        fs.ensureDirSync(foldPath)
        await creatFile(file)
        // fs.ensureDirSync(foldPath1)
        await renameFoldPath(nodesTwo)
        const flag =fs.existsSync( finalPath)
        expect(flag).toEqual(true)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })

  test('renameFoldPath --改所有文件名', (done) => {
    // 自备独立测试数据
 let foldPath = rootPath + '/test/temp/myVue/myTable'
 let file = rootPath + '/test/temp/myVue/myTable/testTemplate.vue'
    const finalPath = rootPath + '/test/temp/myVue/myTable/test-template.vue'

    async function get() {
      try {
        fs.ensureDirSync(foldPath)
        await creatFile(file)
        await renameFoldPath(nodesTwo)
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
