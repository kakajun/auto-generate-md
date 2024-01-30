import type { ItemType } from '../src/types'

import { getCountMd, setCountMd } from '../src/commands/wirte-md'
import { nodeOne } from './utils/nodes-test'

describe('getCountMd', () => {
  it('should correctly count the total number of rows and size', () => {
    const datas: ItemType[] = [...nodeOne]
    const result = getCountMd(datas)
    expect(result).toEqual({
      rowTotleNumber: 4 + 4 + 4,
      sizeTotleNumber: 96 * 3,
      coutObj: {
        '.vue': 3
      }
    })
  })
})

describe('setCountMd', () => {
  it('should correctly format the count string', () => {
    const obj = {
      rowTotleNumber: 4 + 4 + 4,
      sizeTotleNumber: 96 * 3,
      coutObj: {
        '.vue': 3
      }
    }

    const result = setCountMd(obj)
    const expected =
      '😍 代码总数统计：\n' +
      '后缀是 .vue 的文件有 3 个\n' +
      '总共有 3 个文件\n' +
      '总代码行数有: 12行,\n' +
      '总代码字数有: 288个\n'

    expect(result).toEqual(expected)
  })
})
