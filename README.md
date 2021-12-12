# 自动生成目录md目录说明文件

## 说明

### example，是我为演示准备的一些文件，并没有其他用

![image](https://github.com/majun2232/auto-generate-md/blob/master/md.png)

## 使用方法
全局安装
> npm i agmd -g

安装完成后, 在需要记录md的文件夹下面输入`agmd`, 会自动生成相对路径下的文件夹和文件的名字，如果文件里面还有在头部写注释的话，那么会一并带过来自动生成md文件。对于工程比较大的开发来说，这个脚本或许会帮你省下些许时间。

## 功能
1. 自动生成匹配目录的文件夹名和文件(已经按名称进行排序)
2. 自动进行层级目录判断进行缩进
3. 如果文件顶部有注释, 那么会自动进行判断
4. 支持在任意文件目录下递归查找下级文件(不要在很大目录下执行啊!!!递归直到该级目录下没有文件为止)
5. 目前支持记录 .js .vue .ts 和文件夹, 当然也支持其他, 这个版本我就写这么多, 后续有需要的可以提pr

## 背景
1. 大家有没有被要求写一个目录文件的md说明呢？
2. 或者工程目录和文件被移动位置重构了，这时还需要重新修改md文件里面的目录说明
3. 接手老工程，看了md说明，能对文件夹里面的文件功能做到一目了然，而不是点开对应文件去看

基于以上三点痛点，这边就开撸代码，分享出来，解决和我有相同需求的人。

首先要得到所有文件夹和文件名，并且是children格式，那么必然会有个递归，从文件夹里面一直找到文件，
下面先来个简单的，让大家一看就懂，这里主要是循环递归目录，把一个文件或文件夹当做一个obj，放到nodes里面，然后创建了一个level字段，记录文件的层级深度，为后面的排版按层级设置提供必要信息

```js
function getFileNodes(nodes = [], dir = './', level = 0) {
  let files = fs
    .readdirSync(dir)
    .map(item => {
      const fullPath = path.join(dir, item)
      const isDir = fs.lstatSync(fullPath).isDirectory()
      return {
        name: item,
        isDir: isDir,
        level
      }
    })
  for (let index = 0; index < files.length; index++) {
    const item = files[index]
    let note = '' // 文件注释
    let arr = filterArr.findIndex(obj => obj === item.name)
    if (arr === -1) {
      const fullPath = path.join(dir, item.name)
      const isDir = fs.lstatSync(fullPath).isDirectory()
      if (isDir) {
      // 递归
        getFileNodes((item.children = []), fullPath, level + 1)
      } else {

      }
      nodes.push(item)
    }
  }
  // 控制返回时间节点,不让提前返回
  return nodes
}
```
调用上面的方法，就能够得到一个生成的children的对象，把它打印生成到js文件中，这样子方便后续调试`wirteJs(JSON.stringify(nodes), './readme-file.js')`

```js
/**
 * @description: 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
function wirteJs(data, filePath) {
  let file = path.resolve(__dirname, filePath)
  const pre = 'export default'
  // 异步写入数据到文件
  fs.writeFile(file, pre + data, { encoding: 'utf8' }, err => {})
}
```
再用一个递归取出所有需要的信息，有人可能会要讲一个递归不能搞定么？ 还要搞两个？我之前也是搞的一个，是能生成出来，但是因为生成出来的文件，没有按我们需要的要求，比如文件排前面，按名称排序，所以生成出来的对应不到编辑器，那还是个摆设，下面的两个push就不能合成一个，合成一个就会出现文件夹和文件位置摆放错误，虽然文字还是相同的文字，位置很重要

```js
/**
 * @description: 递归得到文件名+note
 * @param {*} datas
 * @param {*} keys
 * @return {*}
 */
function getNote(datas, keys) {
  let nodes = keys ? keys : []
  datas.forEach(obj => {
    if (obj.children) {
      // 文件夹
      let md = setMd(obj)
      nodes.push(md)
      getNote(obj.children, nodes)
    }
    // 文件
    else {
      let md = setMd(obj)
      nodes.push(md)
    }
  })
  return nodes
}
