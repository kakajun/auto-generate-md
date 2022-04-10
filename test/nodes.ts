const rootPath = process.cwd().replace(/\\/g, '/')
export default [
  {
    name: 'app-file-test.vue',
    isDir: false,
    level: 2,
    note: ' // 我就是个注释',
    imports: [rootPath + '/test/temp/aa.vue'],
    belongTo: ['base'],
    size: 96,
    copyed: false,
    rowSize: 4,
    suffix: '.vue',
    fullPath: rootPath + '/test/temp/app-file-test.vue'
  },
  {
    name: 'aa.vue',
    isDir: false,
    copyed: false,
    level: 2,
    note: ' // 我就是个注释',
    imports: [],
    belongTo: ['base'],
    size: 96,
    rowSize: 4,
    suffix: '.vue',
    fullPath: rootPath + '/test/temp/aa.vue'
  }
]
