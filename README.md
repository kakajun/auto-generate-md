# agmd(auto generate md)

> 这是一个前端代码管理的辅助工具，在任何需要生成文档的，文件夹下的控制台中输入`agmd`， 就能自动生成目录 md 说明(部分功能需要在src目录下), 同时能够统计分析当前工程的各类型文件总量和代码总量，还提供一些实用的工具，具体看下面功能特征

[![]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)
[![]( https://github.com/kakajun/auto-generate-md/actions/workflows/test.yml/badge.svg?branch=master)]( https://github.com/kakajun/auto-generate-md/actions/workflows/test.yml)
[![]( https://app.circleci.com/pipelines/github/kakajun/auto-generate-md)]( https://app.circleci.com/pipelines/github/kakajun/auto-generate-md)

简体中文 | [English](https://github.com/kakajun/auto-generate-md/blob/master/README.EN.md)

 ## 🚀  功能特性

😍 一键统计工程的文件数和代码总量

📦 一键补充缺省后缀名 .js .vue 这样子能方便vscode编辑器点击直接跳转查看代码

🚘 一键更改文件或者文件名,驼峰命名为kable-case

⛵ 把工程所有引用更改绝对路径为相对路径(方便点击下钻查看文件)

♨️ 把工程按路由标记分类(对拆分工程很重要)

☝️ 把工程按分类对拆分工程(自动拆分的错误可控, 手动拆分会有各种问题)

✈️ 全程界面命令选择操作, 不用记命令

😍 得到一个包含整个工程结构树的json

💡 一键拿到文件和文件夹名字, 并生成JSON输出

🔥 用TypeScript书写,85%的代码全部书写了测试用例

## 设计初衷

1. 统计工程量, 看看咱们工程究竟有多少个文件, 多少代码量
2. 如果仅仅只是为了重命文件和文件夹, 那么其实这个库没有存在的必要, 因为我们可以自己随手写个node代码, 就全部重命名了, 问题的关键是, 我们内部工程有很多依赖, 像这样子 `import { replaceName } from '../src/commands/rename-path'` , 我们需要一个工具, 能够帮我们自动生成目录, 快速定位到文件,也进行重命名来减少重复劳动, 提升效率.
3. 如果想把工程1分2做成按路由拆分的微服务, 那么需要知道哪些文件被工程1用到了, 哪些文件被工程2用到了, 那么就需要一个工具, 来进行标记,甚至清除没有被标记的文件.


### 操作界面

![image](https://github.com/kakajun/auto-generate-md/blob/master/md3.png)
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


3. 命令说明
- 帮助
- 生成结构树文档
- 修改为相当路径
- 修改为绝对路径(暂未实现)
- 补全文件后缀
- 统一命名文件夹为KebabCase
- 统一命名文件为KebabCase
- 记录节点Json
- 给需要分类的都打上标记
- 删除标记
- 分类


4. 代码结构说明(由本插件agmd生成)
```
├── bin
│ └── bin.js
├── lib
│ ├── commands
│ │ ├── get-file.d.ts
│ │ └── wirte-md.d.ts
│ ├── index.cjs.js
│ ├── index.d.ts
│ └── index.esm.js
├── script
│ ├── cli
│ │ ├── handle.ts
│ │ └── index.ts
│ ├── help
│ │ └── index.ts
├── src
│ ├── commands
│ │ ├── agmd.ts
│ │ ├── base.ts            /* 界面命令注册在这里 */
│ │ ├── change-path.ts            /* 整个文件主要把绝对路径修改为相对路径 */
│ │ ├── get-file.ts            /* 获取文件相关方法 */
│ │ ├── mark-file.ts
│ │ ├── mark-write-file.ts
│ │ └── wirte-md.ts            /* 生成md说明文档 */
│ ├── shared
│ │ ├── constant.ts
│ ├── bin.ts
│ └── index.ts            /* 这里抛出一些高级操作方法 */
├── test
│ └── index.js
└── unuse
```

5. 高级用法
给文件打标记分类, 需要在src的同级目录下, 设置一个文件叫classify.js, 从里面读取需要配置的信息, 注意路径一定是带@符号的绝对路径, 没有配置, 那么程序会自动退出


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
5. 拆分老代码工程, 手工量大还容易出错, 程序控制又快又好
6. 为什么绝对路径要改相对路径? 大家用vscode重命名文件时, 有没发现, 引用文件是绝对路径时, 文件没变化.....而且点击下钻查看文件详情还点不下去????但是相对路径不会有这个问题
7. 文件有后缀能一目了然文件是js文件还是vue文件
8. 一切需要手工重复操作的, 都可以用插件脚本搞定, 留时间学新知识更好
9. 补全缀是刚需, 很多伙伴就不喜欢写文件后缀, 所以import引入的是组件还是js 得去查看, 很不方便

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

### 写在最后

本工程有26个测试, 大家如果想扩展什么功能, 测试代码跑起来, 很方便, 也欢迎大家克隆本工程然后提交进行PR！

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

0.3.0
✈️ 全程界面命令选择操作

⛵ 把工程所有引用更改绝对路径为相对路径(方便点击下钻查看文件)

♨️ 把工程所有引用文件都加上后缀(方便点击下钻查看文件)

👏 把工程按路由标记分类(对拆分工程很重要)

☝️ 把工程按分类对拆分工程(自动拆分的错误可控, 手动拆分会有各种问题)

0.3.3
优化提示日志打印
对路由进行自动分析
增加单元测试到26个,覆盖率达到84%,一些没必要的方法就没测试

0.3.7
升级所有依赖到最新

0.3.8
操作界面改成中文的, 我还是做不到大爱全世界, 先给自己和中国伙伴用好就行了, 同时增加功能只补全后缀, 但不更改路径

0.3.14
重构代码, 修改打包有esbuild转为tsc编译, 同时修改里面本身为异步操作的fs.readFileSync改为await  readFile ,同时新增部分测试用例使得覆盖率达到85%
