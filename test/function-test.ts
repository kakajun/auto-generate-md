// import path from 'path';
import { witeFile } from '../src/commands/mark-file'
import { nodesMark, routersMarg } from './nodes'
import fs from 'fs-extra'
import { creatFile, creatFileNoimport } from './utils'
const rootPath = process.cwd().replace(/\\/g, '/')
const file = rootPath + '/test/temp/wite-file-test.vue'
creatFileNoimport(file)
const fold = rootPath + '/test/temp/my'
fs.ensureDirSync(fold)
const file2 = rootPath + '/test/temp/my/wite-file2.vue'
creatFile(file2)
const file3 = rootPath + '/test/temp/my/aa.vue'
creatFileNoimport(file3)
witeFile(nodesMark, routersMarg)
