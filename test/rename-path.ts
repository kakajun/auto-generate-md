import { replaceName } from '../src/commands/rename-path'
import * as fs from 'fs-extra'

// 模拟fs-extra模块


jest.mock('fs-extra')
describe('replaceName function tests', () => {
  const MOCK_FILE_INFO = {
    // '/path/to/ExampleFile.txt': 'file contents',
    '/path/to/example-file.txt': 'file contents',
    '/path/to/ExampleDirectory/': 'directory contents'
  }

  beforeEach(() => {
    ;(fs as any).__setMockFiles(MOCK_FILE_INFO)
  })

  test('should rename a file to camelCase', async () => {
    const fullPath = '/path/to/example-file.txt'

    console.log(fs.pathExists(fullPath), '??')

    const result = await replaceName(fullPath, true)
    expect(result.newName).toBe('ExampleFile.txt')
    expect(result.filename).toBe('example-file.txt')
    // expect(fs.rename).toHaveBeenCalledWith(expect.any(String), expect.any(String))
  })

  test('should rename a file to kebab-case', async () => {
    const fullPath = '/path/to/ExampleFile.txt'
    const result = await replaceName(fullPath)
    expect(result.newName).toBe('example-file.txt')
    expect(result.filename).toBe('ExampleFile.txt')
    expect(fs.rename).toHaveBeenCalledWith(expect.any(String), expect.any(String))
  })

  test('should handle directory renaming', async () => {
    const fullPath = '/path/to/ExampleDirectory/'
    const result = await replaceName(fullPath)
    expect(result.newName).toBe('example-directory')
    expect(result.filename).toBe('ExampleDirectory')
    expect(fs.copy).toHaveBeenCalledWith(
      fullPath,
      fullPath.replace('ExampleDirectory', 'example-directory'),
      expect.any(Object)
    )
    expect(fs.rm).toHaveBeenCalledWith(fullPath.replace('ExampleDirectory', 'example-directory'), {
      recursive: true,
      force: true
    })
  })
})
