import help from '../help'
interface parseType {
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
  if (settings.ignore) {
    settings.ignores = settings.ignore.split(' ')
  }
  if (settings.include) {
    settings.includes = settings.include.split(' ')
  }
  return settings
}

export default handle
