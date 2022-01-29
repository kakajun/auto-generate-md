import arg from 'arg'
const stringToArgs = (rawArgs: string[]) => {
  const args = arg(
    {
      '--ignore': String,
      '--include': String,
      '--version': Boolean,
      '--help': Boolean,
      '-h': '--help',
      '-i': '--ignore',
      '-in': '--include',
      '-v': '--version'
    },
    {
      argv: rawArgs.slice(2)
    }
  )
  return {
    help: args['--help'],
    ignore: args['--ignore'],
    include: args['--include'],
    version: args['--version']
  }
}

export default stringToArgs
