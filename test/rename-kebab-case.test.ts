import fs from 'fs'
import { renameKebabCase, checkCamelFile } from '../src/commands/rename-kebab-case'
import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('rename-kebab-case.test')
debug.enabled = true
const file = rootPath + '/test/temp/MyTemplate.vue'
function setCamelCaseFile() {
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
test('rename-kebab-case.test--修改kebab-case', (done) => {
  async function get() {
    try {
      await setCamelCaseFile()
      await renameKebabCase(rootPath + '/test/temp')
      const existFlag = fs.existsSync(rootPath + '/test/temp/my-template.vue')
      expect(existFlag).toEqual(true)
      done()
    } catch (error) {
      done(error)
    }
  }
  get()
})

test('checkCamelFile --检测kebab-case', () => {
   expect(checkCamelFile('/test/temp/MyTemplate.vue')).toEqual(true)
})
