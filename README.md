# agmd(auto generate md)

> 在任何需要生成文档的，文件夹下的控制台中输入`agmd`， 就能自动生成目录 md 说明

[![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)

简体中文 | [English](https://github.com/kakajun/auto-generate-md/blob/master/README.EN.md)

 ## 🚀  Features

🔥 Written in TypeScript

🔋 build with esbuild

💡 easy get foldName and fileName.

### 案例

![image](https://github.com/kakajun/auto-generate-md/blob/master/md2.png)

### 使用方法
需要有node环境
1. 全局安装
> npm i agmd -g

安装完成后，在需要记录 md 的文件夹下面输入`agmd`，会自动生成相对路径下的文件夹和文件的名字，如果文件里面还有在头部写注释的话，那么会一并带过来自动生成 md 文件。生成的文件名为`readme-md.md`， 路径为刚刚输入命名的路径同级别下，对于工程比较大的开发来说，这个脚本或许会帮你省下些许时间。

2. 作为依赖安装
> npm i agmd -D

在package.json的scripts 中配置 agmd: npx agmd --ignore lib,node_modules,dist --include .js,.ts,.vue   可以在每次启动或打包时,带上命令行来自动更新文档


example，是我为演示准备的一些文件，并没有其他用

3. 高级用法
有些需要把自动生成的文档插入到某个自动生成的 md 当中, 该插件导出了自动生成的 md 数据方法, 还有`getFileNodes`获得所有文件的具体信息, 可以 DIY 做出不同的文档( 方法名不用记忆, 由于是ts写的,所以会自动点出来)
>const agmd = require('agmd')

es中:
 >import agmd from 'agmd'

- 其中 agmd.getFileNodes() 可以获得具体文件相关的信息, 该函数可传一个参数

- agmd.getMd() 得到最终输出的信息
note: 上面两个方法均可传一个option入参,其格式为:
  option: { ignore: string[] | undefined; include: string[] | undefined }
#### 命令行参数说明
1. 使用agmd -h 来查看帮助
2. 可以带上 --ignore 忽略输出文件或文件夹, 默认为: img,styles,node_modules,LICENSE,.git,.github,dist,.husky,.vscode,readme-file.js,readme-md.js
3. 可以带上 --include 要求只输出带此后缀文件, 默认只输出 .js,.vue,.ts, 可自己加jsx,json 等

### 创作背景

1. 大家有没有被要求写一个目录文件的 md 说明呢？
2. 或者工程目录和文件被移动位置重构了，这时还需要重新修改 md 文件里面的目录说明
3. 接手老工程，看了 md 说明，能对文件夹里面的文件功能做到一目了然，而不是点开对应文件去看
4. 分析源码工程需要做点笔记

### 功能

1. 自动生成匹配目录的文件夹名和文件(已经按名称进行排序)
2. 自动进行层级目录判断进行缩进
3. 如果文件顶部有注释， 那么会自动进行判断
4. 支持在任意文件目录下递归查找下级文件(不要在很大目录下执行啊!!!递归直到该级目录下没有文件为止)
5. 支持命令行参数配置, 可以自定义忽略文件和过滤后缀名文件
6. 命令行解析

控制台命令: agmd--include str--ignore str

可选项:
  --include string  / -i string.......... 包含解析的后缀
  --ignore string  / -in string........... 忽略文件名

例子:
  --ignore / -i  img,styles,node_modules,LICENSE,.git,.github,dist,.husky,.vscode,readme-file.js,readme-md.js
  --include / -in  .js,.vue,.ts

注意:
配置中的字符串之间不应有空格

命令行例子:
$ agmd  --ignore lib,node_modules,dist --include .js,.ts,.vue`

### 相关文章

[掘金-自动生成目录 md 文件](https://juejin.cn/post/7030030599268073508)

### 更新记录
0.1.3
1. 采用esbuild 进行打包
2. 并且用eslint, preter规范写法, 规范
3. 用ts进行改写
4. 支持gitee一键同步

0.2.0
支持命令行解析参数,可以动态传参

0.2.6
修复全局安装报错

0.2.9
新增文件统计功能
