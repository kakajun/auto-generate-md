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

export const foldNode = {
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

export const fileNode = {
  name: 'youTemplate',
  isDir: false,
  level: 2,
  note: ' // 我就是个注释',
  imports: ['/test/temp/myTemplate.vue'],
  belongTo: [],
  size: 96,
  copyed: false,
  rowSize: 4,
  suffix: '.vue',
  fullPath: rootPath + '/test/temp/TestKableCase/youTemplate.vue'
}

export const nodesTwo = [
  {
    name: 'checkTestKableCase',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/checkTestKableCase',
    children: [fileNode]
  },
  {
    name: 'TestKableCase',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/TestKableCase',
    children: []
  },
  {
    name: 'checkTestKable',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/checkTestKable',
    children: []
  },
  ...[foldNode]
]
