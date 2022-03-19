export default [
  {
    name: 'bin',
    isDir: true,
    level: 0,
    note: '',
    children: [
      { name: 'agmd.js', isDir: false, level: 1, note: '', noteText: '', size: 8211, rowSize: 290, suffix: '.js' }
    ]
  },
  {
    name: 'lib',
    isDir: true,
    level: 0,
    note: '',
    children: [
      { name: 'index.cjs.js', isDir: false, level: 1, note: '', noteText: '', size: 6805, rowSize: 305, suffix: '.js' },
      { name: 'index.d.ts', isDir: false, level: 1, note: '', noteText: '', size: 630, rowSize: 25, suffix: '.ts' },
      { name: 'index.esm.js', isDir: false, level: 1, note: '', noteText: '', size: 4825, rowSize: 240, suffix: '.js' }
    ]
  },
  {
    name: 'script',
    isDir: true,
    level: 0,
    note: '',
    children: [
      {
        name: 'cli',
        isDir: true,
        level: 1,
        note: '',
        children: [
          { name: 'handle.ts', isDir: false, level: 2, note: '', noteText: '', size: 681, rowSize: 30, suffix: '.ts' },
          { name: 'index.ts', isDir: false, level: 2, note: '', noteText: '', size: 539, rowSize: 38, suffix: '.ts' }
        ]
      },
      {
        name: 'help',
        isDir: true,
        level: 1,
        note: '',
        children: [
          { name: 'index.ts', isDir: false, level: 2, note: '', noteText: '', size: 640, rowSize: 38, suffix: '.ts' }
        ]
      },
      { name: 'build.js', isDir: false, level: 1, note: '', noteText: '', size: 172, rowSize: 8, suffix: '.js' },
      { name: 'builder.js', isDir: false, level: 1, note: '', noteText: '', size: 1239, rowSize: 74, suffix: '.js' }
    ]
  },
  {
    name: 'src',
    isDir: true,
    level: 0,
    note: '',
    children: [
      { name: 'agmd.ts', isDir: false, level: 1, note: '', noteText: '', size: 635, rowSize: 27, suffix: '.ts' },
      { name: 'index.ts', isDir: false, level: 1, note: '', noteText: '', size: 7310, rowSize: 323, suffix: '.ts' }
    ]
  },
  {
    name: 'test',
    isDir: true,
    level: 0,
    note: '',
    children: [
      { name: 'index.js', isDir: false, level: 1, note: '', noteText: '', size: 88, rowSize: 4, suffix: '.js' }
    ]
  },
  {
    name: 'unuse',
    isDir: true,
    level: 0,
    note: '',
    children: [
      { name: 'assets', isDir: true, level: 1, note: '', children: [] },
      {
        name: 'components',
        isDir: true,
        level: 1,
        note: '',
        children: [
          {
            name: 'user-ruler.vue',
            isDir: false,
            level: 2,
            note: '',
            noteText: '/* 这是vue2.0写法 */\r',
            size: 3652,
            rowSize: 204,
            suffix: '.vue'
          },
          {
            name: 'user-rulerts.vue',
            isDir: false,
            level: 2,
            note: '',
            noteText: '/* 这是ts写法 */\r',
            size: 4219,
            rowSize: 239,
            suffix: '.vue'
          }
        ]
      },
      {
        name: 'App.vue',
        isDir: false,
        level: 1,
        note: '',
        noteText: '/* App主入口 */\r',
        size: 695,
        rowSize: 31,
        suffix: '.vue'
      },
      {
        name: 'main.js',
        isDir: false,
        level: 1,
        note: '',
        noteText: '/* 入口 */\r',
        size: 340,
        rowSize: 13,
        suffix: '.js'
      }
    ]
  },
  { name: '.eslintrc.js', isDir: false, level: 0, note: '', noteText: '', size: 938, rowSize: 67, suffix: '.js' }
]
