/* 测试公共方法 */
import fs from 'fs'
import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('utils')
debug.enabled = true

export  function creatFile(file: string) {
  const str = `// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>`
  fs.writeFileSync(file, str, { encoding: 'utf8' })
}

export function creatFileNoimport(file: string) {
  const str = `// 我就是个注释
<script setup>
</script>`
  fs.writeFileSync(file, str, { encoding: 'utf8' })
}

export function setFile() {
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
  try {
    fs.writeFileSync(file, str, { encoding: 'utf8' })
  } catch (error) {
    debug(error)
  }
}
