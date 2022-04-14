const rootPath = process.cwd().replace(/\\/g, '/')
export const nodeOne= [
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
    name: 'app2-file-test.vue',
    isDir: false,
    level: 2,
    note: ' // 我就是个注释',
    imports: [rootPath + '/test/temp/aa.vue'],
    belongTo: ['base'],
    size: 96,
    copyed: false,
    rowSize: 4,
    suffix: '.vue',
    fullPath: rootPath + '/test/temp/app2-file-test.vue'
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

export const nodesTwo = [
  {
    name: 'TestKableCase',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/TestKableCase',
    children: [
      {
        name: 'youTemplate',
        isDir: false,
        level: 2,
        note: ' // 我就是个注释',
        imports: [],
        belongTo: [],
        size: 96,
        copyed: false,
        rowSize: 4,
        suffix: '.vue',
        fullPath: rootPath + '/test/temp/TestKableCase/youTemplate.vue'
      }
    ]
  },
  {
    name: 'checkTestKableCase',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/checkTestKableCase',
    children: [
      {
        name: 'youTemplate',
        isDir: false,
        level: 2,
        note: ' // 我就是个注释',
        imports: [],
        belongTo: [],
        size: 96,
        copyed: false,
        rowSize: 4,
        suffix: '.vue',
        fullPath: rootPath + '/test/temp/checkTestKableCase/MyTemplate.vue'
      }
    ]
  },
  {
    name: 'checkTestKableCase2',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/checkTestKableCase2',
    children: []
  },
  {
    name: 'checkTestKableCase2',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/checkTestKableCase',
    children: [
      {
        name: 'checkTestKableCaseInner',
        isDir: true,
        level: 1,
        note: '',
        copyed: false,
        imports: [],
        belongTo: [],
        fullPath: rootPath + '/test/temp/checkTestKableCase/checkTestKableCaseInner'
      }
    ]
  }
]
