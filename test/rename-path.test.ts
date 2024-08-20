import { replaceName } from '../src/commands/rename-path'
import fs from 'fs-extra'
import { vol } from 'memfs'

jest.mock('fs')
describe('replaceName function tests', () => {
  beforeEach(async () => {
    vol.reset()
    await fs.mkdirp('/pathA/to/ExampleDirectory/')
    fs.writeFileSync('/pathA/to/example-file.txt', 'file contents')
    fs.writeFileSync('/pathA/to/FoolFile.txt', 'fool contents')
  })

  test('should rename a file to camelCase', async () => {
    const fullPath = '/pathA/to/example-file.txt'
    const result = await replaceName(fullPath, true)
    expect(result.newName).toBe('ExampleFile.txt')
    expect(result.filename).toBe('example-file.txt')
  })

  test('should rename a file to kebab-case', async () => {
    const fullPath = '/pathA/to/FoolFile.txt'
    const result = await replaceName(fullPath)
    expect(result.newName).toBe('fool-file.txt')
    expect(result.filename).toBe('FoolFile.txt')
  })
})
