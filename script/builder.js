import { build } from 'esbuild'
import fs from 'fs-extra'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import packageJson from '../package.json' assert { type: 'json' };

const { name, version, author } = packageJson;

const banner = {
  js: `/*!
* ${name} v${version}
* author:${author}
* ${new Date()}
*/`
}
const isDev = process.env.NODE_ENV !== 'production'

const binBuildParams = {
  platform: 'node',
  color: true,
  entryPoints: ['src/bin.ts'],
  outdir: 'bin',
  minify: true,
  format: 'cjs',
  bundle: true,
  sourcemap: true,
  logLevel: 'error',
  plugins: []
}
const buildParams = {
  platform: 'node',
  color: true,
  banner: banner,
  entryPoints: ['src/index.ts'],
  minify: !isDev,
  bundle: true,
  sourcemap: true,
  logLevel: 'error',
  plugins: [dtsPlugin()]
}
async function builder() {
  fs.removeSync('dist')
  buildParams.format = 'esm'
  buildParams.outfile = './lib/index.esm.js'
  await build(buildParams)
  buildParams.format = 'cjs'
  buildParams.outfile = './lib/index.cjs.js'
  await build(buildParams)
  await build(binBuildParams)
  process.exit(0)
}
export default builder
