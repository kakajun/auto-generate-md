const st = `Usage: agmd--include str--ignore str

  Options:
  --include string  / -i string..........  include  file extension
  --ignore string  / -in string........... ignore file or fold
  --version / -v               ........... seach vesion
  Str deafult:
  --ignore  img,styles,node_modules,LICENSE,.git,.github,dist,.husky,.vscode,readme-file.js,readme-md.js
  --include  .js,.vue,.ts

  Note:
  There should be no space between strings in a configuration

  Examples:
  $ agmd  --ignore lib,node_modules,dist --include .js,.ts,.vue`

function help() {
  console.log(st)
  process.exit(0)
}
export default help
