/* 测试公共方法 */
import fs from 'fs'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

export function creatFile(file: string) {
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
  const file = rootPath + '/temp/TestKableCase/youTemplate.vue'
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
    logger.error(error)
  }
}
