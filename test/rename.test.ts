import {
  foldNode,
  fileNode,
  // nodesTwo
} from './nodes'
import fs from 'fs-extra'
import {
  // renameFilePath,
  changePathFold,
  changePathName,
  // renameFoldPath,
  replaceName,
  checkCamelFile
} from '../src/commands/rename-path'

import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('rename.test')
debug.enabled = true

describe('rename.test的测试', () => {
  // let foldPath = rootPath + '/test/temp/checkTestKableCase'
  let foldPath2 = rootPath + '/test/temp/checkTestKableCase2'
  // let foldPath3 = rootPath + '/test/temp/checkTestKableCase/checkTestKableCaseInner'

  test('checkCamelFile --检测kebab-case', () => {
    let flag = checkCamelFile('MyTemplate.vue')
    debug('flag:', flag)
    expect(flag).toEqual(true)
  })

  test('changePathFold --递归修改文件夹node的path', () => {
  changePathFold(foldNode, { newName: 'check-test-kable-case', filename: 'checkTestKableCase' })
      //  debug('foldNode', JSON.stringify(foldNode))
    const str =
      '{"name":"check-test-kable-case","isDir":true,"level":1,"note":"","copyed":false,"imports":[],"belongTo":[],"fullPath":"D:/worker/auto-generate-md/test/temp/check-test-kable-case","children":[{"name":"check-test-kable-caseInner","isDir":true,"level":1,"note":"","copyed":false,"imports":[],"belongTo":[],"fullPath":"D:/worker/auto-generate-md/test/temp/check-test-kable-case/checkTestKableCaseInner"}]}'
    expect(str).toEqual(JSON.stringify(foldNode))
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
    async function get() {
      try {
        fs.ensureDirSync(foldPath2)
        await replaceName(foldPath2)
        expect(1).toEqual(1)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })

  // test('renameFoldPath --改所有文件名', (done) => {
  //   async function get() {
  //     try {
  //       fs.ensureDirSync(foldPath)
  //       fs.ensureDirSync(foldPath3)
  //       await renameFoldPath(nodesTwo)
  //       expect(1).toEqual(1)
  //       done()
  //     } catch (error) {
  //       done(error)
  //     }
  //   }
  //   get()
  // })

  //   test('renamePath --改kebab-case', (done) => {
  //     let foldPath = rootPath + '/test/temp/TestKableCase'
  //     const finalStr = `<template>
  //   <div class=""></div>
  // </template>

  // <script>
  // import UserRuler from './search-form'
  // export default {
  // }
  // </script>
  // `
  //     async function get() {
  //       try {
  //         await ensureDirSync(foldPath)
  //         await setFile()
  //         await renameFoldPath(nodesTwo)
  //         let newPath = rootPath + '/test/temp/test-kable-case/you-template.vue'
  //         const str = fs.readFileSync(newPath, 'utf-8')
  //         expect(str).toEqual(finalStr)
  //         done()
  //       } catch (error) {
  //         done(error)
  //       }
  //     }
  //     get()
  //   })
})
