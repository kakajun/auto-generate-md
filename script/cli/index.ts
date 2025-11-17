import arg from 'arg'
const stringToArgs = (rawArgs: string[]) => {
  const args = arg(
    {
      '--ignore': String,
      '--include': String,
      '--version': Boolean,
      '--help': Boolean,
      '--dry-run': Boolean,
      '--silent': Boolean,
      '-h': '--help',
      '-i': '--ignore',
      '-in': '--include',
      '-v': '--version',
      '-d': '--dry-run',
      '-s': '--silent'
    },
    {
      argv: rawArgs.slice(2)
    }
  )
  return {
    help: args['--help'],
    ignore: args['--ignore'],
    include: args['--include'],
    version: args['--version'],
    dryRun: args['--dry-run'],
    silent: args['--silent']
  }
}

export default stringToArgs
