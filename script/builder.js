const { build } = require('esbuild')
const fs = require('fs-extra')
const pkg = require('../package.json')
const { dtsPlugin } = require('esbuild-plugin-d.ts')
const banner = {
  js: `/*!
* ${pkg.name} v${pkg.version}
* author:${pkg.author}
* ${new Date()}
*/`
}
const isDev = process.env.NODE_ENV !== 'production'
/**
 * ESBuild Params
 * @link https://esbuild.github.io/api/#build-api
 */

const binBuildParams = {
  platform: 'node',
  color: true,
  entryPoints: ['src/agmd.ts'],
  outdir: 'bin',
  minify: true,
  format: 'cjs',
  bundle: true,
  sourcemap: true,
  logLevel: 'error',
  incremental: true,
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
  incremental: true,
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
module.exports = builder
