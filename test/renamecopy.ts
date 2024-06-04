import { foldNode, fileNode } from './utils/nodes-test.ts'
import fs from 'fs-extra'
import {
  // renameFold,
  renameFilePath,
  changePathFold,
  changePathName,
  // renameFoldPath,
  replaceName,
  toCameCase,
  toKebabCase,
  checkCamelFile
} from '../src/commands/rename-path.ts'
// import { creatFile } from './utils/utils'
import { createConsola } from 'consola'
import type { ItemType } from '../src/types.ts'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

// Mock fs-extra functions for testing
jest.mock('fs-extra', () => ({
  pathExists: jest.fn(),
  copy: jest.fn(),
  rm: jest.fn(),
  rename: jest.fn()
}))

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  parse: jest.fn((path) => ({ base: path }))
}))

describe('rename.test的测试', () => {
  test('checkCamelFile --检测kebab-case', () => {
    const flag = checkCamelFile('MyTemplate.vue')
    logger.info('flag:', flag)
    expect(flag).toEqual(true)
  })

  test('changePathFold --递归修改文件夹node的path', () => {
    changePathFold(foldNode, { newName: 'check-test-kable-case', filename: 'checkTestKableCase' })
    const obj = {
      name: 'check-test-kable-case',
      isDir: true,
      level: 1,
      note: '',
      copyed: false,
      imports: [],
      belongTo: [],
      fullPath: rootPath + '/temp/check-test-kable-case',
      children: [
        {
          name: 'check-test-kable-caseInner',
          isDir: true,
          level: 1,
          note: '',
          copyed: false,
          imports: [],
          belongTo: [],
          fullPath: rootPath + '/temp/check-test-kable-case/checkTestKableCaseInner'
        }
      ]
    }
    const str = JSON.stringify(obj)
    expect(JSON.stringify(foldNode)).toEqual(str)
  })

  test('changePathName --递归修改文件里面的import', () => {
    changePathName(fileNode, { newName: 'you-template', filename: 'youTemplate' })
    // logger.info('tempNode', JSON.stringify(fileNode))
    const finalObj = {
      name: 'you-template',
      isDir: false,
      level: 2,
      note: ' // 我就是个注释',
      imports: [rootPath.toLowerCase() + '/temp/my-template.vue'],
      belongTo: [],
      size: 96,
      copyed: false,
      rowSize: 4,
      suffix: '.vue',
      fullPath: rootPath + '/temp/TestKableCase/you-template.vue'
    }
    expect(fileNode).toMatchObject(finalObj)
  })
})



describe('toCameCase', () => {
  it('should convert hyphen-separated strings to camel case', () => {
    expect(toCameCase('my-file-name')).toBe('MyFileName')
  })
})

describe('toKebabCase', () => {
  it('should convert camel case strings to kebab case', () => {
    expect(toKebabCase('MyFileName')).toBe('my-file-name')
  })
})

describe('renameFilePath', () => {
  const nodesTwo: ItemType[] = [
    {
      name: 'TestKableCase',
      isDir: true,
      level: 1,
      note: '',
      copyed: false,
      imports: [],
      belongTo: [],
      fullPath: '/path/to/temp/TestKableCase',
      children: [
        {
          name: 'TestKableCase2',
          isDir: true,
          level: 1,
          note: '',
          copyed: false,
          imports: [],
          belongTo: [],
          fullPath: '/path/to/temp/TestKableCase/TestKableCase2'
        }
      ]
    }
  ]

  // 假设的模拟函数，实际应根据你的逻辑实现
  const renameFileMock = jest.fn()
  const rewriteFileMock = jest.fn()

  beforeEach(() => {
    // 在每个测试开始前重置模拟函数
    renameFileMock.mockClear()
    rewriteFileMock.mockClear()
    // ;(fs.rename as jest.Mock).mockClear()
  })

  it('should call renameFile and rewriteFile for each file without children', async () => {
    // 替换实际的 renameFile 和 rewriteFile 函数为模拟函数
    // 注意：在实际应用中，你可能需要在 renameFilePath 内部直接使用模拟函数，这里仅作示例
    ;(global as any).renameFile = renameFileMock
    ;(global as any).rewriteFile = rewriteFileMock

    await renameFilePath(nodesTwo)

    // 检查是否调用了 renameFile 和 rewriteFile
    expect(renameFileMock).toHaveBeenCalledTimes(2)
    expect(renameFileMock).toHaveBeenCalledWith(nodesTwo[0], true)

    // 检查 children 是否存在
    if (nodesTwo[0].children) {
      expect(renameFileMock).toHaveBeenCalledWith(nodesTwo[0].children[0], true)
    }

    expect(rewriteFileMock).toHaveBeenCalledTimes(2)
    expect(rewriteFileMock).toHaveBeenCalledWith(nodesTwo[0], true)

    if (nodesTwo[0].children) {
      expect(rewriteFileMock).toHaveBeenCalledWith(nodesTwo[0].children[0], true)
    }

    expect(fs.rename).toHaveBeenCalledTimes(2) // 假设 renameFile 内部调用了 fs.rename
  })
})

// describe('renameFoldPath', () => {
//   const nodes: ItemType[] = [
//     {
//       name: 'TestKableCase',
//       isDir: true,
//       level: 1,
//       note: '',
//       copyed: false,
//       imports: [],
//       belongTo: [],
//       fullPath: '/path/to/temp/TestKableCase',
//       children: [
//         {
//           name: 'TestKableCase2',
//           isDir: true,
//           level: 1,
//           note: '',
//           copyed: false,
//           imports: [],
//           belongTo: [],
//           fullPath: '/path/to/temp/TestKableCase/TestKableCase2'
//         }
//       ]
//     }
//   ]

//   beforeEach(() => {
//     // 在每个测试开始前重置模拟函数
//     // ;(renameFold as jest.Mock).mockClear()
//   })

//   it('should call renameFold for each directory', async () => {
//     await renameFoldPath(nodes, true)

//     // 检查是否调用了 renameFold 正确次数
//     expect(renameFold).toHaveBeenCalledTimes(nodes.length)

//     // 检查具体的调用情况
//     nodes.forEach((node, index) => {
//       expect(renameFold).toHaveBeenNthCalledWith(index + 1, node, true)
//     })
//   })

//   it('should handle nested directories correctly', async () => {
//     await renameFoldPath(nodes, true)

//     // 检查嵌套目录的 renameFold 调用
//     const childNode = nodes[0].children![0]
//     expect(renameFold).toHaveBeenCalledWith(childNode, true)
//   })
// })
