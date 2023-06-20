const st = `使用说明: agmd--include str--ignore str

  选项:
  --include string  / -i string..........  包括文件扩展名
  --ignore string  / -in string........... 忽略文件或者文件夹
  --version / -v               ........... 版本
  各选项的默认配置:
  --ignore  img,styles,node_modules,LICENSE,.git,.github,dist,.husky,.vscode,readme-file.js,readme-md.js
  --include  .js,.vue,.ts

  说明:
  配置中的字符串之间不应有空格

  举例:
  可以在package.json中的scripts下面配置命名:
  $ agmd  --ignore lib,node_modules,dist --include .js,.ts,.vue`

function help() {
  console.log(st)
  process.exit(0)
}
export default help
