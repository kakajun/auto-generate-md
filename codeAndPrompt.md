下面是整个工程的目录文件结构
├── api
│ ├── aa.js            
│ └── user.js            //2工程
├── base
│ └── temp
│ │ ├── aa.vue            // 我就是个注释
│ │ └── app-file-test.vue            
├── script
│ ├── cli
│ │ ├── handle.ts            
│ │ └── index.ts            
│ └── help
│ │ └── index.ts            
├── src
│ ├── commands
│ │ ├── agmd.ts            
│ │ ├── change-path.ts            
│ │ ├── command-actions.ts            /* 界面命令注册在这里 */
│ │ ├── command-handler.ts            // 命令处理逻辑
│ │ ├── get-file.ts            /* 获取文件相关方法 */
│ │ ├── get-router.ts            
│ │ ├── mark-file.ts            /* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
│ │ ├── mark-write-file.ts            
│ │ ├── rename-path.ts            /* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
│ │ └── wirte-md.ts            /* 生成md说明文档 */
│ ├── shared
│ │ └── constant.ts            /* 解析package */
│ ├── utils
│ │ └── router-utils.ts            
│ ├── bin.ts            
│ ├── index.ts            /* 这里抛出一些高级操作方法 */
│ └── types.ts            // 定义 Router 接口
├── temp
│ ├── check-test-kable-case2
│ │ └── testTemplate.vue            // 我就是个注释
│ ├── my
│ │ ├── aa.vue            // 我就是个注释
│ │ └── wite-file2.vue            // 我就是个注释
│ ├── myVue
│ │ └── myTable
│ │ │ └── test-template.vue            // 我就是个注释
│ ├── test-kable-case
│ │ ├── test-kable-case2
│ │ └── youTemplate.vue            // 我就是个注释
│ ├── aa.vue            // 我就是个注释
│ ├── app-file-test.vue            // 我就是个注释
│ ├── app2-file-test.vue            //mark
│ ├── bb.vue            
│ ├── delet-mark-all.vue            // 我就是个注释
│ ├── mark-setmark.vue            //setmark
│ └── wite-file-test.vue            // 我就是个注释
├── test
│ ├── config
│ │ ├── jest-global-setup.ts            
│ │ └── jest.setup.ts            
│ ├── utils
│ │ ├── deep-nodes-test.ts            
│ │ ├── function-test.ts            
│ │ ├── nodes-test.ts            
│ │ └── utils.ts            /* 测试公共方法 */
│ ├── __mocks__
│ │ └── fs.ts            
│ ├── change-path.test.ts            
│ ├── get-file.test.ts            
│ ├── get-router.test.ts            
│ ├── mark-file.test.ts            
│ ├── mark-write-file.test.ts            // import { createConsola } from 'consola'
│ ├── rename-path.test.ts            
│ ├── rename.test.ts            
│ ├── renamecopy.ts            
│ └── wirte-md.test.ts            
├── test2
│ └── temp
│ │ ├── my
│ │ │ ├── aa.vue            // 我就是个注释
│ │ │ └── wite-file2.vue            // 我就是个注释
│ │ └── wite-file-test.vue            // 我就是个注释
├── unuse
│ ├── assets
│ ├── components
│ │ ├── test
│ │ │ └── deep
│ │ │ │ └── user.vue            //2工程
│ │ ├── test2
│ │ │ └── HelloWorld.vue            //2工程
│ │ └── user-rulerts.vue            
│ ├── test
│ │ ├── index.js            /* 我就是个测试 */
│ │ └── user-rulerts.vue            
│ ├── App.vue            
│ ├── main.js            //2工程
│ └── mixins.js            
├── classify.js            
└── jest.config.ts            

😍 代码总数统计：
后缀是 .js 的文件有 6 个
后缀是 .vue 的文件有 22 个
后缀是 .ts 的文件有 35 个
总共有 63 个文件
总代码行数有: 3,406行,
总代码字数有: 88,680个
path:/api/aa.js
export default function name(params) {

}
//2工程

path:/script/cli/handle.ts
import help from '../help'
import pkg from '../../package.json'
interface parseType {
  version?: Boolean | undefined
  includes?: string[]
  ignores?: string[]
  help?: Boolean | undefined
  ignore?: string | undefined
  include?: string | undefined
}
function handle(settings: parseType) {
  if (settings.help) {
    help()
  }
  if (settings.version) {
    console.log(`agmd version is: ` + '\x1B[36m%s\x1B[0m', pkg.version)
    process.exit(0)
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

path:/src/shared/constant.ts
/* 解析package */
import { name, version } from '../../package.json';

export const CWD = process.cwd();

export const VERSION = version;

export const PKG_NAME = name;

path:/script/help/index.ts
const st = `使用说明:
1. 在控制台按上下切换功能并回车进行确认, 执行相对应的操作！
2. 可以在package.json中的scripts下面配置如下，然后运行命令:
agmd  --include str  --ignore str
  选项:
  --include string  / -i string..........  包括文件扩展名
  --ignore string  / -in string........... 忽略文件或者文件夹

  各选项的默认配置:
  --ignore  img,styles,node_modules,LICENSE,.git,.github,dist,.husky,.vscode,readme-file.js,readme-md.js
  --include  .js,.vue,.ts,.tsx

  说明:
  配置中的字符串之间不应有空格

  举例:

  $ agmd  --ignore lib,node_modules,dist --include .js,.ts,.vue`

function help() {
  console.log(st)
  process.exit(0)
}
export default help

path:/base/temp/aa.vue
// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>
path:/src/utils/router-utils.ts

import { access, readFile } from 'fs/promises';
/**
 * 解析路由文件中的路由路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string} - 解析出的路由路径。
 */
export function parseRouterPath(line: string): string {
  const pathRegex = /path:\s*['"]([^'"]+)['"]/
  const match = line.match(pathRegex)
  return match ? match[1] : ''
}

/**
 * 解析路由文件中的组件路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string | ''} - 解析出的组件路径或null。
 */
export function parseComponentPath(line: string): string {
  const componentRegex = /component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/
  const match = line.match(componentRegex)
  return match ? match[1] : ''
}

export async function getDependencies(packageJsonPath: string): Promise<string[]> {
  let dependencies: string[] = [];
  if (packageJsonPath) {
    try {
      await access(packageJsonPath);
      const pkg = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
      dependencies = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
    } catch (error) {
      console.error(error);
    }
  }
  return dependencies;
}

path:/src/commands/agmd.ts
#!/usr/bin/env node
/* 搞个文件做bug测试,命令行不好调试 */
import { generateAllAction } from './command-actions'
import { getMd } from './wirte-md'
import stringToArgs from '../../script/cli'
import handle from '../../script/cli/handle'

 async function main() {
  const options = stringToArgs(process.argv)
  const { ignores: ignore, includes: include } = handle(options)
  const { md, nodes } =await getMd({ ignore, include })
  await generateAllAction(nodes, md)
}

main()

path:/temp/check-test-kable-case2/testTemplate.vue
// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>
path:/src/bin.ts
#!/usr/bin/env node
import { Command } from 'commander'
import { handleCommand } from './commands/command-handler'
const program = new Command()
program.action(handleCommand)
program.parse(process.argv)

path:/temp/my/aa.vue
// 我就是个注释
<script setup>
</script>
path:/temp/myVue/myTable/test-template.vue
// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>
path:/temp/test-kable-case/youTemplate.vue
// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>
path:/test/utils/deep-nodes-test.ts
const rootPath = process.cwd().replace(/\\/g, '/')
const nodeComponents = [
  {
    name: 'test',
    isDir: true,
    level: 0,
    note: '',
    imports: [],
    belongTo: [],
    children: [
      {
        name: 'deep',
        isDir: true,
        level: 1,
        note: '',
        imports: [],
        belongTo: [],
        children: [
          {
            name: 'user.vue',
            isDir: false,
            level: 2,
            note: '//2工程',
            imports: [rootPath + '/api/user.js'],
            belongTo: [],
            size: 1791,
            rowSize: 109,
            suffix: '.vue',
            fullPath: rootPath + '/unuse/components/test/deep/user.vue'
          }
        ],
        fullPath: rootPath + '/unuse/components/test/deep'
      }
    ],
    fullPath: rootPath + '/unuse/components/test'
  },
  {
    name: 'test2',
    isDir: true,
    level: 0,
    note: '',
    imports: [],
    belongTo: [],
    children: [
      {
        name: 'HelloWorld.vue',
        isDir: false,
        level: 1,
        note: '//2工程',
        imports: [rootPath + '/unuse/components/test/deep/user.vue'],
        belongTo: [],
        size: 411,
        rowSize: 31,
        suffix: '.vue',
        fullPath: rootPath + '/unuse/components/test2/HelloWorld.vue'
      }
    ],
    fullPath: rootPath + '/unuse/components/test2'
  },
  {
    name: 'user-rulerts.vue',
    isDir: false,
    level: 0,
    note: '',
    imports: [rootPath + '/unuse/components/test/deep/user.vue'],
    belongTo: [],
    size: 2503,
    rowSize: 105,
    suffix: '.vue',
    fullPath: rootPath + '/unuse/components/user-rulerts.vue'
  }
]

export default nodeComponents

path:/test/config/jest-global-setup.ts
import fs from 'fs-extra'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

module.exports = async () => {
  logger.start('清空测试文件夹')
  // 你可以在这里执行一些全局初始化代码
  const foldPath = rootPath + '/temp'
  const foldPath2 = rootPath + '/test2'
  function deleteFolderRecursive(p: string) {
    if (fs.existsSync(p)) {
      fs.readdirSync(p).forEach((file) => {
        const curPath = `${p}/${file}`
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath)
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(p)
    }
  }

  deleteFolderRecursive(foldPath)
  deleteFolderRecursive(foldPath2)
}

path:/temp/aa.vue
// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>
path:/test/change-path.test.ts
import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { getRelatPath, makeSuffix, changeImport, writeToFile, getImportName } from '../src/commands/change-path'
import { nodeOne } from './utils/nodes-test'
import { createConsola } from 'consola'
const logger = createConsola({
  level: 4
})
const rootPath = process.cwd().replace(/\\/g, '/')
describe('change-path的测试', () => {
  test('getRelatPath--获取相对地址', () => {
    expect(getRelatPath('/unuse/components/user-rulerts.vue', '/unuse/App.vue')).toEqual(
      './components/user-rulerts.vue'
    )
  })

  test('makeSuffix--补全后缀和@替换', () => {
    expect(makeSuffix('@/src/commands/change-path', '@/src/commands/change-path')).toEqual(
      path.resolve('src/commands/change-path.ts').replace(/\\/g, '/')
    )
  })
  test('makeSuffix--得到import', () => {
    const arrs = getImportName(
      `import
      { getRelatPath,
         makeSuffix,
         changeImport
      } from '@/unuse/components/user-rulerts'`,
      ['@types/node']
    )
    logger.info('arrs: ', arrs)
    expect(arrs).toEqual('@/unuse/components/user-rulerts')
  })

  test('changeImport--更改不规范path', () => {
    expect(
      changeImport(
        "import { getRelatPath, makeSuffix, changeImport } from '@/unuse/components/user-rulerts'",
        path.resolve('unuse/App.vue').replace(/\\/g, '/'),
        ['@types/node']
      )
    ).toEqual({
      filePath: '@/unuse/components/user-rulerts',
      impName: './components/user-rulerts.vue',
      absoluteImport: rootPath + '/unuse/components/user-rulerts.vue'
    })
  })

  test('writeToFile--更改不规范path', (done) => {
    try {
      const node = nodeOne[0]
      // 1. 随机创建一个文件
      const str = `<script setup>
import {
  UserRuler,
  aa
} from '@/unuse/components/user-rulerts'
</script>`
      //2. 预期得到内容
      const finalStr = `<script setup>
import {
  UserRuler,
  aa
} from '../unuse/components/user-rulerts.vue'
</script>`

      const file = path.resolve(rootPath, node.fullPath)
      logger.info('file: ', file)

      async function get() {
        // 异步写入数据到文件
        await writeFile(file, str, { encoding: 'utf8' })
        logger.success('Write successful')
        await writeToFile(node, true)
        const getStr = await readFile(file, 'utf-8')
        expect(getStr).toEqual(finalStr)
        done()
      }
      get()
    } catch (error) {
      done(error)
    }
  })
})

path:/test/__mocks__/fs.ts
import { fs } from 'memfs'

fs.mkdirSync('/tmp')
if (process.env.TMPDIR) {
  fs.mkdirSync(process.env.TMPDIR, { recursive: true })
}

const fsRealpath = fs.realpath
;(fsRealpath as any).native = fsRealpath

module.exports = { ...fs, realpath: fsRealpath }

path:/test2/temp/my/aa.vue
// 我就是个注释
<script setup>
</script>
path:/test2/temp/wite-file-test.vue
// 我就是个注释
<script setup>
</script>
path:/unuse/components/test/deep/user.vue
//2工程
//2工程
ue2.0写法 */
<template>
  <div class="wrapper">
    <SketchRule
      :thick="thick"
      :scale="scale"
      :width="582"
      :height="482"
      :start-x="startX"
      :start-y="startY"
      :shadow="shadow"
      :hor-line-arr="lines.h"
      :ver-line-arr="lines.v"
      :corner-active="true"
      @handleLine="handleLine"
      @onCornerClick="handleCornerClick"
    >
    </SketchRule>
    <div
      id="screens"
      ref="screensRef"
      @wheel="handleWheel"
      @scroll="handleScroll"
    >
      <div ref="containerRef" class="screen-container">
        <div id="canvas" :style="canvasStyle" />
      </div>
    </div>
  </div>
</template>
<script>
import { businessUserInfo, updataUserInfo, addUserInfo } from '../../../../api/user.js'
export default {
  components: { SketchRule },
}
</script>
<style lang="scss">
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: sans-serif;
}

body * {
  box-sizing: border-box;
  user-select: none;
}

.wrapper {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 600px;
  height: 500px;
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
}

#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}

.scale-value {
  position: absolute;
  bottom: 100%;
  left: 0;
}

.button {
  position: absolute;
  bottom: 100%;
  left: 100px;
}

#canvas {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 160px;
  height: 200px;
  margin-left: -80px;
  background: lightblue;
  transform-origin: 50% 0;
}
</style>

//1工程
//1工程
//2工程
//2工程
//2工程
//2工程
//2工程
//2工程
//2工程
//2工程

path:/unuse/test/index.js
/* 我就是个测试 */
import app from '../app.vue'
console.log('main')

path:/unuse/components/user-rulerts.vue

<script lang="ts">
// import { SketchRule } from 'vue3-sketch-ruler'
// import 'vue3-sketch-ruler/lib/style.css'
// import { SketchRule } from '../../lib/index.es'
// import '/lib/style.css'
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick,
} from "vue";
import { SketchRule } from "./test/deep/user.vue"; // 这里可以换成打包后的

const rectWidth = 600;
const rectHeight = 320;
export default defineComponent({
  components: { SketchRule },
  setup() {
    const screensRef = ref(null);
    const containerRef = ref(null);
    const state = reactive({
      scale: 2, //658813476562495, //1,
      startX: 0,
      startY: 0,
      lines: {
        h: [433, 588],
        v: [33, 143],
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: true, // 显示参考线
    });
    const shadow = computed(() => {
      return {
        x: 0,
        y: 0,
        width: rectWidth,
        height: rectHeight,
      };
    });
    const canvasStyle = computed(() => {
      return {
        width: rectWidth,
        height: rectHeight,
        transform: `scale(${state.scale})`,
      };
    });
    onMounted(() => {
      // 滚动居中
      screensRef.value.scrollLeft =
        containerRef.value.getBoundingClientRect().width / 2 - 400;
    });

    const handleScroll = () => {
      const screensRect = document
        .querySelector("#screens")
        .getBoundingClientRect();
      const canvasRect = document
        .querySelector("#canvas")
        .getBoundingClientRect();

      // 标尺开始的刻度
      const startX =
        (screensRect.left + state.thick - canvasRect.left) / state.scale;
      const startY =
        (screensRect.top + state.thick - canvasRect.top) / state.scale;
      state.startX = startX;
      state.startY = startY;
    };
    // 控制缩放值
    const handleWheel = (e: {
      ctrlKey: any;
      metaKey: any;
      preventDefault: () => void;
      deltaY: number;
    }) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const nextScale = parseFloat(
          Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2)
        );
        state.scale = nextScale;
      }
      nextTick(() => {
        handleScroll();
      });
    };

    return {
      screensRef,
      containerRef,
      state,
      shadow,
      canvasStyle,
      handleWheel,
      handleScroll,
    };
  },
});
</script>
//2工程

path:/unuse/App.vue

<script>
import UserRuler from './components/user-rulerts.vue'
</script>

<template>
  <div>
      <UserRuler />
    <a href="https://data.avuejs.com/build/1" target="_blank" class="redlink">
      实例地址:https://data.avuejs.com/build/1
    </a>
    <div>按住Ctril+鼠标滚轮可以缩放页面</div>
  </div>

</template>

<style>
#app {
  margin-top: 60px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}
</style>
//2工程

path:/unuse/components/test2/HelloWorld.vue
//2工程


<script>
import user from '../test/deep/user.vue';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

path:/classify.js
export default [
  {
    name: '2工程',
    router: [
      {
        path: '/spc/list',
        component: '@/unuse/App.vue'
      },
      {
        path: '/spc/list',
        component: '@/unuse/main.js'
      },
    ]
  }
]

path:/script/cli/index.ts
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

path:/api/user.js
//2工程
export default function name(params) {}
//2工程

path:/base/temp/app-file-test.vue
<script setup>
import {
  UserRuler,
  aa
} from '../unuse/components/user-rulerts.vue'
</script>
path:/src/commands/change-path.ts
import fs from 'fs'
import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { createConsola } from 'consola'
import { getDependencies } from '../utils/router-utils'
import type { ItemType } from '../types'
const logger = createConsola({
  level: 4
})

const rootPath = process.cwd().replace(/\\/g, '/')

/**
 * 检查当前目录是否为项目根目录。
 * 根据是否存在 package.json 文件来判断。
 */
function isRootDirectory(): boolean {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  try {
    fs.accessSync(packageJsonPath, fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

/**
 * @desc: 递归循环所有文件

 * @param {Array} nodes      整个文件的nodes
 */
export async function changePath(nodes: ItemType[], nochangePath?: Boolean) {
  async function getNode(objs: ItemType[]) {
    for (const ele of objs) {
      if (ele.children) {
        await getNode(ele.children)
      } else {
        if (isRootDirectory()) {
          await writeToFile(ele, true, nochangePath)
        }
      }
    }
  }
  await getNode(nodes)
}

/**
 * @desc: 这里返回没有@ 符号的路径
 * @param {string} absoluteImport  依赖本身名字
 * @param {string} fullPath  文件本身绝对地址
 */
export function getRelatPath(absoluteImport: string, fullPath: string) {
  let relatPath = path.relative(path.dirname(fullPath), absoluteImport).replace(/\\/g, '/')
  if (!relatPath.startsWith('.')) {
    relatPath = './' + relatPath
  }
  return relatPath
}

/**
 * @desc: 补后缀的方法+替换前缀
 * @param {string} filePath  正则匹配到的依赖路径
 * @param {string} fullPath  本身文件名路径
 * @param {string} impName   正确的名字
 */
export function makeSuffix(filePath: string, fullPath: string) {
  let absoluteImport = filePath.includes('@')
    ? filePath.replace('@', process.cwd())
    : path.resolve(path.dirname(fullPath), filePath)

  const lastName = path.extname(absoluteImport)

  if (!lastName) {
    const suffixes = ['.ts', '.vue', '.tsx', '.js', '/index.js', '/index.vue']
    for (const suffix of suffixes) {
      if (fs.existsSync(absoluteImport + suffix)) {
        absoluteImport += suffix
        // logger.info('补充后缀:', absoluteImport + suffix)
        break
      }
    }
  }
  return absoluteImport.replace(/\\/g, '/')
}

/**
 * @desc: 根据一行代码匹配import的详细内容  TODO 这里还得优化

 */
export function getImportName(ele: string, dependencies: string[]) {
  let str = ''
  const flag = dependencies.some((item) => ele.indexOf(item) > -1)
  const reg = / from [\"|\'](.*)[\'|\"]/
  // 这里只收集组件依赖, 插件依赖排除掉
  if (!flag && ele.indexOf('/') > -1 && ele.indexOf('//') !== 0) {
    const impStr = ele.match(reg)
    // 没有import的不转
    if (impStr && impStr[1]) str = impStr[1]
  }
  return str
}

/**
 * @desc: 找到import并返回全路径和原始路径
 * @param {string} ele    找到的行引入
 * @param {string} fullPath  文件的全路径
 */
export function changeImport(ele: string, fullPath: string, dependencies: string[], nochangePath?: Boolean) {
  const impName = getImportName(ele, dependencies)
  if (!impName) return null

  const absoluteImport = makeSuffix(impName, fullPath)
  const obj = {
    impName: nochangePath ? impName : getRelatPath(absoluteImport, fullPath),
    filePath: impName,
    absoluteImport
  }
  return obj
}

/**
 * @desc:  写文件
 * @param {string} file  目标地址
 */
export async function writeToFile(node: ItemType, isRelative?: Boolean, nochangePath?: Boolean) {
  const { fullPath } = node
  const packageJsonPath = path.join(rootPath, 'package.json')
  const dependencies = await getDependencies(packageJsonPath)

  try {
    const fileStr = await readFile(fullPath, 'utf-8')
    const lines = fileStr.split(/[\n]/g)

    // 使用 map() 来处理每一行
    const updatedLines = lines.map((line) => {
      if (line.includes('from') && isRelative) {
        const obj = changeImport(line, fullPath, dependencies, nochangePath)
        if (obj && obj.impName) {
          // 使用模板字符串来增加可读性
          logger.info(`Updating import in node: ${node}`)
          return line.replace(obj.filePath, obj.impName)
        }
      }
      return line
    })

    // 检查是否有任何变化
    if (updatedLines.join('\n') !== fileStr) {
      await writeFile(fullPath, updatedLines.join('\n'), 'utf-8')
      logger.success(`Write file successful: ${fullPath}`)
    }
  } catch (error) {
    // 提供更详细的错误信息
    logger.error(`Error reading file: ${fullPath}, Error: ${error}`)
  }
}
/**
 * @description: Write the result to JS file 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
export async function wirteJsNodes(data: string, filePath: string): Promise<void> {
  const file = path.resolve(rootPath, filePath)
  const content = `export default ${data}`
  await writeFile(file, content, { encoding: 'utf8' })
  logger.success(`Write file successful: ${filePath}`)
}

path:/src/index.ts
/* 这里抛出一些高级操作方法 */
import { getMd } from './commands/wirte-md'
import { getFileNodes } from './commands/get-file'
export { getMd, getFileNodes }

path:/temp/my/wite-file2.vue
// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>
path:/test/utils/function-test.ts
import { replaceName } from '../../src/commands/rename-path'
import { createConsola } from 'consola'
// const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

async function get() {
  const p = await replaceName('/path/to/myFile.txt')
  logger.info('p: ', p)
  logger.info('我这里来了!!!')
}
get()

path:/test/config/jest.setup.ts
import fs from 'fs-extra'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const foldPath = rootPath + '/temp'
const logger = createConsola({
  level: 4
})

beforeAll(() => {
  logger.info('new unit test start')
  fs.ensureDirSync(foldPath)
  // 你可以在这里执行一些全局初始化代码
})

path:/temp/app-file-test.vue
// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>
path:/test/get-file.test.ts
import { getFile, getImport, getFileNodes, getNote, setMd } from '../src/commands/get-file'
import { creatFile } from './utils/utils'
import type { ItemType } from '../src/types'
import deepNodes from './utils/deep-nodes-test'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

// 由于linux的空格数和window的空格数不一样, 所以size始终不一样, 无法测试, 所以这里干掉size
// 递归树结构设置size为0
function setSize(temparrs: any[]) {
  temparrs.forEach((item) => {
    item.size = 0
    if (item.children) {
      setSize(item.children)
    }
  })
}

describe('setMd', () => {
  it('should correctly format the string for a directory', () => {
    const obj: ItemType = {
      name: 'dir',
      isDir: true,
      level: 1,
      note: '',
      fullPath: '',
      belongTo: [],
      imports: []
    }

    const result = setMd(obj, false)

    expect(result).toEqual('│ ├── dir\n')
  })

  it('should correctly format the string for a file', () => {
    const obj: ItemType = {
      name: 'file.js',
      isDir: false,
      level: 1,
      note: 'note',
      fullPath: '',
      belongTo: [],
      imports: []
    }
    const result = setMd(obj, true)
    expect(result).toEqual('│ └── file.js            note\n')
  })
})

describe('get-file的测试', () => {
  test('getFile--获取注释', (done) => {
    const file = rootPath + '/temp/app-file-test.vue'
    const file2 = rootPath + '/temp/aa.vue'
    try {
      async function get() {
        await creatFile(file)
        await creatFile(file2)
        const obj = await getFile(file)
        expect(obj).toEqual({
          note: '// 我就是个注释',
          rowSize: 4,
          size: 63,
          imports: [rootPath + '/temp/aa.vue']
        })
        done()
      }
      get()
    } catch (error) {
      done(error)
    }
  })

  test('getImport--获取每个文件依赖的方法', (done) => {
    const str = `<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    try {
      async function get() {
        const sarr = str.split(/[\n]/g)
        const arrs = await getImport(sarr, rootPath + '/temp/bb.vue')
        expect(arrs).toMatchObject([rootPath + '/unuse/components/user-rulerts.vue'])
        done()
      }
      get()
    } catch (error) {
      done(error)
    }
  })

  test('getFileNodes--生成所有文件的node信息', (done) => {
    try {
      async function get() {
        const arrs = await getFileNodes(rootPath + '/unuse/components')
        setSize(arrs)
        setSize(deepNodes)
        // console.log(JSON.stringify(deepNodes), 'arrs')
        expect(arrs).toMatchObject(deepNodes)

        done()
      }
      get()
    } catch (error) {
      logger.error(error)
      done(error)
    }
  })

  test('getImport--获取每个文件依赖的方法', (done) => {
    try {
      async function get() {
        const notes = await getFileNodes(rootPath + '/unuse/components')
        setSize(notes)
        const arrs = getNote(notes)
        const final = [
          '├── test\n',
          '│ └── deep\n',
          '│ │ └── user.vue            //2工程\n',
          '├── test2\n',
          '│ └── HelloWorld.vue            //2工程\n',
          '└── user-rulerts.vue            \n'
        ]
        // console.log(JSON.stringify(arrs), 'arrs')
        expect(arrs).toMatchObject(final)
        done()
      }
      get()
    } catch (error) {
      logger.error(error)
      done(error)
    }
  })
})

path:/test2/temp/my/wite-file2.vue
// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>
path:/unuse/test/user-rulerts.vue

<script lang="ts">
// import { SketchRule } from 'vue3-sketch-ruler'
// import 'vue3-sketch-ruler/lib/style.css'
// import { SketchRule } from '../../lib/index.es'
// import '/lib/style.css'
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick,
} from "vue";
import { SketchRule } from "./test/deep/user.vue"; // 这里可以换成打包后的

const rectWidth = 600;
const rectHeight = 320;
export default defineComponent({
  components: { SketchRule },
  setup() {
    const screensRef = ref(null);
    const containerRef = ref(null);
    const state = reactive({
      scale: 2, //658813476562495, //1,
      startX: 0,
      startY: 0,
      lines: {
        h: [433, 588],
        v: [33, 143],
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: true, // 显示参考线
    });
    const shadow = computed(() => {
      return {
        x: 0,
        y: 0,
        width: rectWidth,
        height: rectHeight,
      };
    });
    const canvasStyle = computed(() => {
      return {
        width: rectWidth,
        height: rectHeight,
        transform: `scale(${state.scale})`,
      };
    });
    onMounted(() => {
      // 滚动居中
      screensRef.value.scrollLeft =
        containerRef.value.getBoundingClientRect().width / 2 - 400;
    });

    const handleScroll = () => {
      const screensRect = document
        .querySelector("#screens")
        .getBoundingClientRect();
      const canvasRect = document
        .querySelector("#canvas")
        .getBoundingClientRect();

      // 标尺开始的刻度
      const startX =
        (screensRect.left + state.thick - canvasRect.left) / state.scale;
      const startY =
        (screensRect.top + state.thick - canvasRect.top) / state.scale;
      state.startX = startX;
      state.startY = startY;
    };
    // 控制缩放值
    const handleWheel = (e: {
      ctrlKey: any;
      metaKey: any;
      preventDefault: () => void;
      deltaY: number;
    }) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const nextScale = parseFloat(
          Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2)
        );
        state.scale = nextScale;
      }
      nextTick(() => {
        handleScroll();
      });
    };

    return {
      screensRef,
      containerRef,
      state,
      shadow,
      canvasStyle,
      handleWheel,
      handleScroll,
    };
  },
});
</script>
//2工程

path:/unuse/main.js
//2工程
import { createApp } from 'vue'
// import '../lib/style.css'
import SketchRule from './components/test2/HelloWorld.vue'
// import moduleName from '../api/aa.js';
const app = createApp(App)
// app.use(SketchRule);
import './mixins.js'
// const MyComponent = app.component('SketchRule')
// console.log(MyComponent, 'MyComponentMyComponent')
app.mount('#app')

path:/jest.config.ts
export default {
  // 指定 Jest 环境
  testEnvironment: 'node',
  // 指定处理 TypeScript 的转换器
  transform: {
    '^.+\\.ts$': 'ts-jest'
    // 'ts-jest': {
    //   useESM: true,
    // },
  },
  // 设置模块文件的扩展名
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // 设置需要忽略的文件或目录
  testPathIgnorePatterns: ['/node_modules/'],

  // 如果使用 ESM，则设置此选项
  extensionsToTreatAsEsm: ['.ts'],
  globalSetup: './test/config/jest-global-setup.ts', // 全局
  setupFilesAfterEnv: ['./test/config/jest.setup.ts'],
  clearMocks: true,
  // 配置 Jest 如何解析模块，特别是对于 ESM
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}

