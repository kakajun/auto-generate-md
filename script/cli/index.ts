import arg from 'arg'
const stringToArgs = (rawArgs: string[]) => {
  const args = arg(
    {
      '--ignore': String,
      '--include': String,
      '--help': Boolean,
      '-h': '--help',
      '-i': '--ignore',
      '-in': '--include'
    },
    {
      argv: rawArgs.slice(2)
    }
  )
  return {
    help: args['--help'],
    ignore: args['--ignore'],
    include: args['--include']
  }
}

export default stringToArgs
