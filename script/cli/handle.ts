import help from '../help'
import pkg from '../../package.json'
interface parseType {
  version?: Boolean | undefined
  includes?: string[]
  ignores?: string[]
  help: Boolean | undefined
  ignore: string | undefined
  include: string | undefined
}
function handle(settings: parseType) {
  if (settings.help) {
    help()
  }
  if (settings.version) {
    console.log(`agmd version is: ` + '\x1B[36m%s\x1B[0m', pkg.version)
    process.exit(0)
  }
  if (settings.ignore) {
    settings.ignores = settings.ignore.split(' ')
  }
  if (settings.include) {
    settings.includes = settings.include.split(' ')
  }
  return settings
}

export default handle
