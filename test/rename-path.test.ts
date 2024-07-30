import { replaceName } from '../src/commands/rename-path'
import fs from 'fs-extra'
import { vol } from 'memfs'

jest.mock('fs')
describe('replaceName function tests', () => {
  beforeEach(async () => {
    vol.reset()
    await fs.mkdirp('/path/to/ExampleDirectory/')
    fs.writeFileSync('/path/to/example-file.txt', 'file contents')
    fs.writeFileSync('/path/to/FoolFile.txt', 'fool contents')
  })

  test('should rename a file to camelCase', async () => {
    const fullPath = '/path/to/example-file.txt'
    const result = await replaceName(fullPath, true)
    expect(result.newName).toBe('ExampleFile.txt')
    expect(result.filename).toBe('example-file.txt')
  })

  test('should rename a file to kebab-case', async () => {
    const fullPath = '/path/to/FoolFile.txt'
    const result = await replaceName(fullPath)
    expect(result.newName).toBe('fool-file.txt')
    expect(result.filename).toBe('FoolFile.txt')
  })

  // test('should handle directory renaming', async () => {
  //   const fullPath = '/path/to/ExampleDirectory/'
  //   const result = await replaceName(fullPath)
  //   expect(result.newName).toBe('example-directory')
  //   expect(result.filename).toBe('ExampleDirectory')
  //   expect(fs.copy).toHaveBeenCalledWith(
  //     fullPath,
  //     fullPath.replace('ExampleDirectory', 'example-directory'),
  //     expect.any(Object)
  //   )
  //   expect(fs.rm).toHaveBeenCalledWith(fullPath.replace('ExampleDirectory', 'example-directory'), {
  //     recursive: true,
  //     force: true
  //   })
  // })
})
