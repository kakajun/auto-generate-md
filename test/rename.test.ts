import fs from 'fs-extra'
import { renamePath, replaceName, emptyDir } from '../src/commands/rename-path'

import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('rename.test')
debug.enabled = true
  let foldPath = rootPath + '/test/temp'
  emptyDir(foldPath)
const nodes = [
  {
    name: 'TestKableCase',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/TestKableCase',
    children: [
      {
        name: 'youTemplate',
        isDir: false,
        level: 2,
        note: ' // 我就是个注释',
        imports: [],
        belongTo: [],
        size: 96,
        copyed: false,
        rowSize: 4,
        suffix: '.vue',
        fullPath: rootPath + '/test/temp/TestKableCase/youTemplate.vue'
      }
    ]
  }
]
function setFile() {
  const file = rootPath + '/test/temp/TestKableCase/youTemplate.vue'
  const str = `<template>
  <div class=""></div>
</template>

<script>
import UserRuler from './SearchForm'
export default {
}
</script>
`
  return new Promise<void>((resove, reject) => {
    try {
      fs.writeFile(file, str, { encoding: 'utf8' }, () => {
        console.log('Write successful')
        resove()
      })
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}

function creatFold(foldPath: string) {
  return new Promise<void>((resolve) => {
    if (fs.existsSync(foldPath)) {
      resolve()
    } else {
      fs.mkdir(foldPath, function (err) {
        if (err) {
          return console.error(err)
        }
        resolve()
      })
    }
  })
}

test('replaceName --改文件名', (done) => {
  let foldPath = rootPath + '/test/temp/checkTestKableCase'
  async function get() {
    try {
      await creatFold(foldPath)
      await replaceName(foldPath)
      expect(1).toEqual(1)
      done()
    } catch (error) {
      done(error)
    }
  }
  get()
})
test('checkCamelFile --检测kebab-case', (done) => {
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
      await renamePath(nodes)
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
test('emptyDir --清空文件夹及文件', () => {
  let foldPath = rootPath + '/test/temp'
  emptyDir(foldPath)
  const flag = fs.existsSync(foldPath)
  expect(flag).toEqual(false)
})
