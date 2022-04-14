import fs from 'fs'
export function creatFile(file: string) {
  return new Promise<void>((resolve) => {
    const str = `// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>`
    fs.writeFile(file, str, { encoding: 'utf8' }, () => {
      resolve()
    })
  })
}
