const rootPath = process.cwd().replace(/\\/g, '/')
export const nodeOne = [
  {
    name: 'app-file-test.vue',
    isDir: false,
    level: 2,
    note: ' // 我就是个注释',
    imports: [rootPath + '/temp/aa.vue'],
    belongTo: ['mark'],
    size: 96,
    copyed: false,
    rowSize: 4,
    suffix: '.vue',
    fullPath: rootPath + '/temp/app-file-test.vue'
  },
  {
    name: 'app2-file-test.vue',
    isDir: false,
    level: 2,
    note: ' // 我就是个注释',
    imports: [rootPath + '/temp/aa.vue'],
    belongTo: ['mark'],
    size: 96,
    copyed: false,
    rowSize: 4,
    suffix: '.vue',
    fullPath: rootPath + '/temp/app2-file-test.vue'
  },
  {
    name: 'aa.vue',
    isDir: false,
    copyed: false,
    level: 2,
    note: ' // 我就是个注释',
    imports: [],
    belongTo: ['mark'],
    size: 96,
    rowSize: 4,
    suffix: '.vue',
    fullPath: rootPath + '/temp/aa.vue'
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
  fullPath: rootPath + '/temp/checkTestKableCase',
  children: [
    {
      name: 'checkTestKableCaseInner',
      isDir: true,
      level: 1,
      note: '',
      copyed: false,
      imports: [],
      belongTo: [],
      fullPath: rootPath + '/temp/checkTestKableCase/checkTestKableCaseInner'
    }
  ]
}

export const fileNode = {
  name: 'youTemplate',
  isDir: false,
  level: 2,
  note: ' // 我就是个注释',
  imports: [rootPath + '/temp/myTemplate.vue'],
  belongTo: [],
  size: 96,
  copyed: false,
  rowSize: 4,
  suffix: '.vue',
  fullPath: rootPath + '/temp/TestKableCase/youTemplate.vue'
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
    fullPath: rootPath + '/temp/TestKableCase',
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
        fullPath: rootPath + '/temp/TestKableCase/TestKableCase2'
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
    fullPath: rootPath + '/temp/wite-file-test.vue'
  },
  {
    name: 'my',
    isDir: true,
    level: 1,
    note: '',
    copyed: false,
    imports: [],
    belongTo: [],
    fullPath: rootPath + '/temp/my',
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
        fullPath: rootPath + '/temp/my/aa.vue'
      },
      {
        name: 'wite-file2',
        isDir: false,
        level: 2,
        note: ' // 我就是个注释',
        imports: [rootPath + '/temp/my/aa.vue'],
        belongTo: ['test2'],
        size: 96,
        copyed: false,
        rowSize: 4,
        suffix: '.vue',
        fullPath: rootPath + '/temp/my/wite-file2.vue'
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
             component: '@/temp/wite-file-test.vue'
           },
           {
             path: '/wite-file2',
             component: '@/temp/my/wite-file2.vue'
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
    fullPath: rootPath + '/temp/myVue',
    children: [
      {
        name: 'myTable',
        isDir: true,
        level: 1,
        note: '',
        copyed: false,
        imports: [],
        belongTo: [],
        fullPath: rootPath + '/temp/myVue/myTable',
        children: [
          {
            name: 'testTemplate',
            isDir: false,
            level: 2,
            note: ' // 我就是个注释',
            imports: ['/temp/myTemplate.vue'],
            belongTo: [],
            size: 96,
            copyed: false,
            rowSize: 4,
            suffix: '.vue',
            fullPath: rootPath + '/temp/myVue/myTable/testTemplate.vue'
          }
        ]
      }
    ]
  }
]
