/* 测试公共方法 */
import { writeFile } from 'fs/promises'

export async function creatFile(file: string) {
  const str = `// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>`
  await writeFile(file, str, { encoding: 'utf8' })
}

export async function creatFileNoimport(file: string) {
  const str = `// 我就是个注释
<script setup>
</script>`
  await writeFile(file, str, { encoding: 'utf8' })
}
