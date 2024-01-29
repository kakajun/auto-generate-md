import builder from './builder.js'
import { createConsola } from 'consola'
const logger = createConsola({
  level: 4
})
try {
  builder()
  logger.success('Packed! Generated bin and lib files')
} catch (error) {
  logger.error('Packaging failed')
}
