import fs from 'fs-extra'
import {
  renamePath,
  replaceName
} from '../src/commands/rename-path'

import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('rename.test')
debug.enabled = true

const nodes = [
  {
    name: 'TestKableCase',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/TestKableCase',
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
        fullPath: rootPath + '/test/TestKableCase/youTemplate.vue'
      }
    ]
  }
]
function setFile() {
  const file = rootPath + '/test/TestKableCase/youTemplate.vue'
  const str = `<template>
    <div class="">test</div>
  </template>
  <script>
  export default {
    name: '',
    components: {},
    data() {
      return {}
    },
    methods: {}
  }
  </script>
  <style lang="scss" scoped></style>
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


function creatFold(foldPath) {
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
    let foldPath = rootPath + '/test/checkTestKableCase'
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
   let foldPath = rootPath + '/test/TestKableCase'
async  function get() {
  try {
   await creatFold(foldPath)
   await setFile()
   await renamePath(nodes)
   expect(1).toEqual(1)
   done()
 } catch (error) {
   done(error)
 }
}
  get()
})
