import fs from 'fs-extra'
import { nodesTwo } from './nodes'
import {
  renameFilePath,
  renameFoldPath,
  replaceName,
  // emptyDir,
  checkCamelFile
} from '../src/commands/rename-path'
import { creatFold, setFile } from './utils'
import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('rename.test')
debug.enabled = true

describe('rename.test的测试', async () => {
  let foldPath = rootPath + '/test/temp/checkTestKableCase'
  let foldPath2 = rootPath + '/test/temp/checkTestKableCase2'
  let foldPath3 = rootPath + '/test/temp/checkTestKableCase/checkTestKableCaseInner'
  await creatFold(foldPath)
  await creatFold(foldPath2)
  await creatFold(foldPath3)
  test('replaceName --改文件名', async (done) => {
    async function get() {
      try {
        await replaceName(foldPath)
        expect(1).toEqual(1)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })

    test('renameFoldPath --改所有文件名', async (done) => {
      async function get() {
        try {
          await renameFoldPath(foldPath)
          expect(1).toEqual(1)
          done()
        } catch (error) {
          done(error)
        }
      }
      get()
    })

  test('renamePath --改kebab-case', (done) => {
    let foldPath = rootPath + '/test/temp/TestKableCase'
    const finalStr = `<template>
  <div class=""></div>
</template>

<script>
import UserRuler from './search-form'
export default {
}
</script>
`
    async function get() {
      try {
        await creatFold(foldPath)
        await setFile()
        await renameFoldPath(nodesTwo)
        let newPath = rootPath + '/test/temp/test-kable-case/you-template.vue'
        const str = fs.readFileSync(newPath, 'utf-8')
        expect(str).toEqual(finalStr)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })
  // test('emptyDir --清空文件夹及文件', () => {
  //   let foldPath = rootPath + '/test/temp'

  //   const flag = fs.existsSync(foldPath)
  //   expect(flag).toEqual(false)
  // })

test('checkCamelFile --检测kebab-case', () => {
  let flag = checkCamelFile('MyTemplate.vue')
  debug('flag:', flag)
  expect(flag).toEqual(true)
})
})
