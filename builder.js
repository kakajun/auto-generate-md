const { build } = require('esbuild')
const fs = require('fs-extra')
const pkg = require('./package.json')
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
const format = ['esm', 'cjs', 'umd']
const buildParams = {
  platform: 'node',
  color: true,
  banner: banner,
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  minify: !isDev,
  format: 'cjs',

  bundle: true,
  sourcemap: true,
  logLevel: 'error',
  incremental: true,
  plugins: []
}
const binBuildParams = {
  platform: 'node',
  color: true,
  banner: banner,
  entryPoints: ['src/agmd.ts'],
  outdir: 'bin',
  minify: !isDev,
  format: 'cjs',
  bundle: true,
  sourcemap: true,
  logLevel: 'error',
  incremental: true,
  plugins: []
}
;(async () => {
  fs.removeSync('dist')
  await build(buildParams)
  await build(binBuildParams)
  process.exit(0)
})()
