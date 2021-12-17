# agmd(auto generate md)

> 在任何需要生成文档的，文件夹下的控制台中输入`agmd`， 就能自动生成目录 md 说明

[![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)

简体中文 | [English](https://github.com/majun2232/auto-generate-md/blob/master/README.EN.md)

### 案例

![image](https://github.com/majun2232/auto-generate-md/blob/master/md.png)

### 使用方法
需要有node环境
1. 全局安装(必须全局安装，否则会报`无法将“agmd”项识别为 cmdlet、函数、脚本文件或可运行程序的名称`)

> npm i agmd -g

安装完成后，在需要记录 md 的文件夹下面输入`agmd`，会自动生成相对路径下的文件夹和文件的名字，如果文件里面还有在头部写注释的话，那么会一并带过来自动生成 md 文件。生成的文件名为`readme-md.md`， 路径为刚刚输入命名的路径同级别下，对于工程比较大的开发来说，这个脚本或许会帮你省下些许时间。

example，是我为演示准备的一些文件，并没有其他用

2. 高级用法
有些需要把自动生成的文档插入到某个自动生成的 md 当中, 该插件导出了自动生成的 md 数据方法, 还有`getFileNodes`获得所有文件的具体信息, 可以 DIY 做出不同的文档
>const { getFileNodes, getMd } = require('agmd')

es中:
 >import {getFileNodes, getMd} from 'agmd'

- 其中 getFileNodes 可以获得具体文件相关的信息
- getMd 得到最终输出的信息

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
5. 目前支持记录 .js .vue .ts 和文件夹， 当然也支持其他， 这个版本我就写这么多， 后续有需要的可以提 pr

### 相关文章

[掘金-自动生成目录 md 文件](https://juejin.cn/post/7030030599268073508)

### 更新记录
0.1.0
1. 采用esbuild 进行打包
2. 并且用eslint, preter规范写法, 规范
3. 用ts进行改写
