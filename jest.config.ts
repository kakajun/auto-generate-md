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
  // 忽略编译产物，避免 Haste 命名冲突与不必要扫描
  modulePathIgnorePatterns: ['<rootDir>/es6', '<rootDir>/lib'],

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
