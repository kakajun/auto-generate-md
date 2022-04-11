import fs from 'fs-extra'
import { renamePath } from '../src/commands/rename-path'
import { ItemType } from '../src/commands/get-file'

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

test('checkCamelFile --检测kebab-case', (done) => {
  fs.mkdir( rootPath + '/test/TestKableCase', async function (err) {
    if (err) {
      return console.error(err)
    }
    try {
      await setFile()
      await renamePath(nodes)
      expect(1).toEqual(1)
      done()
    } catch (error) {
      done(error)
    }
  })
})
