import { getFileNodes } from '../../src/commands/get-file'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

async function get() {
  const arrs = await getFileNodes(rootPath + '/unuse/components')
  logger.info('arrs: ', JSON.stringify(arrs))
  logger.info('我这里来了!!!')
}
get()
