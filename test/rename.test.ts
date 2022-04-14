import { nodesTwo } from './nodes'
import fs from 'fs-extra'
import {
  // renameFilePath,
  renameFoldPath,
  replaceName,
  checkCamelFile
} from '../src/commands/rename-path'

import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('rename.test')
debug.enabled = true

describe('rename.test的测试', () => {
  let foldPath = rootPath + '/test/temp/checkTestKableCase'
  let foldPath2 = rootPath + '/test/temp/checkTestKableCase2'
  let foldPath3 = rootPath + '/test/temp/checkTestKableCase/checkTestKableCaseInner'

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

  test('renameFoldPath --改所有文件名', (done) => {
    async function get() {
      try {
        fs.ensureDirSync(foldPath)
        fs.ensureDirSync(foldPath3)
        await renameFoldPath(nodesTwo)
        expect(1).toEqual(1)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })

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
  test('checkCamelFile --检测kebab-case', () => {
    let flag = checkCamelFile('MyTemplate.vue')
    debug('flag:', flag)
    expect(flag).toEqual(true)
  })
})
