export default {
  // 指定 Jest 环境
  testEnvironment: 'node',
  // 指定处理 TypeScript 的转换器
  transform: {
    '^.+\\.ts$': 'ts-jest',
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
  globalSetup: './test/jest-global-setup.ts', // 更新这里的路径
  // 配置 Jest 如何解析模块，特别是对于 ESM
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
