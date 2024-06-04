import { replaceName } from '../../src/commands/rename-path'
import { createConsola } from 'consola'
// const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

async function get() {
  const p = await replaceName('/path/to/myFile.txt')
  logger.info('p: ', p)
  logger.info('我这里来了!!!')
}
get()
