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
