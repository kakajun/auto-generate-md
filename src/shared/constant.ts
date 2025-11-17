import fs from 'fs'
import path from 'path'

const baseDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd()
const candidates = [
  path.resolve(baseDir, '../../../package.json'),
  path.resolve(baseDir, '../../package.json'),
  path.resolve(baseDir, '../package.json'),
  path.resolve(baseDir, 'package.json')
]
const pkgPath = candidates.find((p) => fs.existsSync(p)) || candidates[0]
const pkgRaw = fs.existsSync(pkgPath) ? fs.readFileSync(pkgPath, 'utf-8') : '{"name":"agmd","version":""}'
const pkg = JSON.parse(pkgRaw) as { name: string; version: string }

export const CWD = process.cwd()
export const VERSION = pkg.version
export const PKG_NAME = pkg.name
