import fs from 'fs-extra'
const rootPath = process.cwd().replace(/\\/g, '/')
// 在所有测试之前运行一次
beforeAll(() => {
  console.log("Global setup before all tests.");
  // 你可以在这里执行一些全局初始化代码
  const foldPath = rootPath + '/temp'
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
});

// 在每个测试之前运行
beforeEach(() => {
  // console.log("Global setup before each test.");
  // 例如，重置全局状态等
});
