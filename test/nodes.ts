const rootPath = process.cwd().replace(/\\/g, '/')
export const nodeOne = [
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
  imports: [rootPath + '/test/temp/myTemplate.vue'],
  belongTo: [],
  size: 96,
  copyed: false,
  rowSize: 4,
  suffix: '.vue',
  fullPath: rootPath + '/test/temp/TestKableCase/youTemplate.vue'
}

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
      fileNode,
      {
        name: 'TestKableCase2',
        isDir: true,
        level: 1,
        note: '',
        copyed: false,
        imports: [],
        belongTo: [],
        fullPath: rootPath + '/test/temp/TestKableCase/TestKableCase2'
      }
    ]
  }
]

export   const nodesMark = [
  {
    name: 'wite-file-test',
    isDir: false,
    level: 2,
    note: '',
    imports: [],
    belongTo: ['test2'],
    size: 96,
    copyed: false,
    rowSize: 4,
    suffix: '.vue',
    fullPath: rootPath + '/test/temp/wite-file-test.vue'
  },
  {
    name: 'my',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/my',
    children: [
      {
        name: 'aa',
        isDir: false,
        level: 2,
        note: ' // 我就是个注释',
        imports: [],
        belongTo: ['test2'],
        size: 96,
        copyed: false,
        rowSize: 4,
        suffix: '.vue',
        fullPath: rootPath + '/test/temp/my/aa.vue'
      },
      {
        name: 'wite-file2',
        isDir: false,
        level: 2,
        note: ' // 我就是个注释',
        imports: [rootPath + '/test/temp/my/aa.vue'],
        belongTo: ['test2'],
        size: 96,
        copyed: false,
        rowSize: 4,
        suffix: '.vue',
        fullPath: rootPath + '/test/temp/my/wite-file2.vue'
      }
    ]
  }
]

  export   const routersMarg = [
       {
         name: 'test2',
         router: [
           {
             path: '/wite-file-test',
             component: '@/test/temp/wite-file-test.vue'
           },
           {
             path: '/wite-file2',
             component: '@/test/temp/my/wite-file2.vue'
           }
         ]
       }
     ]

export const nodesThree = [
  {
    name: 'myVue',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/test/temp/myVue',
    children: [
      {
        name: 'myTable',
        isDir: true,
        level: 1,
        note: '',
        copyed: false,
        imports: [],
        belongTo: [],
        fullPath: rootPath + '/test/temp/myVue/myTable',
        children: [
          {
            name: 'testTemplate',
            isDir: false,
            level: 2,
            note: ' // 我就是个注释',
            imports: ['/test/temp/myTemplate.vue'],
            belongTo: [],
            size: 96,
            copyed: false,
            rowSize: 4,
            suffix: '.vue',
            fullPath: rootPath + '/test/temp/myVue/myTable/testTemplate.vue'
          }
        ]
      }
    ]
  }
]
