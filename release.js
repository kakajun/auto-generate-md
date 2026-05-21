#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

const rootDir = path.resolve(__dirname)
const pkgPath = path.join(rootDir, 'package.json')
const cargoPath = path.join(rootDir, 'Cargo.toml')

function readCurrentVersion() {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  return pkg.version
}

function parseVersion(version) {
  const [main, pre] = version.split('-')
  const parts = main.split('.').map(Number)
  return { major: parts[0], minor: parts[1], patch: parts[2], pre }
}

function inc(version, type) {
  const v = parseVersion(version)
  if (type === 'major') {
    return `${v.major + 1}.0.0`
  }
  if (type === 'minor') {
    return `${v.major}.${v.minor + 1}.0`
  }
  if (type === 'patch') {
    return `${v.major}.${v.minor}.${v.patch + 1}`
  }
  return version
}

function updatePkg(version) {
  const raw = fs.readFileSync(pkgPath, 'utf-8')
  const pkg = JSON.parse(raw)
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  console.log(`  ${path.relative(rootDir, pkgPath)} -> ${version}`)
}

function updateCargo(version) {
  let raw = fs.readFileSync(cargoPath, 'utf-8')
  raw = raw.replace(/^version = ".*"$/m, `version = "${version}"`)
  fs.writeFileSync(cargoPath, raw)
  console.log(`  ${path.relative(rootDir, cargoPath)} -> ${version}`)
}

function step(msg) {
  console.log('\n' + msg)
}

async function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()))
  })
}

async function main() {
  const currentVersion = readCurrentVersion()
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log(`\nCurrent version: ${currentVersion}\n`)

  const patchVer = inc(currentVersion, 'patch')
  const minorVer = inc(currentVersion, 'minor')
  const majorVer = inc(currentVersion, 'major')

  console.log('1) patch   (' + patchVer + ')')
  console.log('2) minor   (' + minorVer + ')')
  console.log('3) major   (' + majorVer + ')')
  console.log('4) custom')

  const choice = await prompt(rl, '\nSelect release type (1-4): ')

  let targetVersion
  switch (choice) {
    case '1':
      targetVersion = patchVer
      break
    case '2':
      targetVersion = minorVer
      break
    case '3':
      targetVersion = majorVer
      break
    case '4':
      targetVersion = await prompt(rl, 'Input custom version: ')
      break
    default:
      console.log('Invalid choice, aborting.')
      rl.close()
      return
  }

  if (!targetVersion || !/^\d+\.\d+\.\d+/.test(targetVersion)) {
    console.log(`Invalid version: ${targetVersion}`)
    rl.close()
    return
  }

  const confirm = await prompt(rl, `\nReleasing v${targetVersion}. Confirm? (y/n) `)
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('Aborted.')
    rl.close()
    return
  }

  step('Updating versions...')
  updatePkg(targetVersion)
  updateCargo(targetVersion)

  const doGit = await prompt(rl, '\nCreate git commit and tag? (y/n) ')
  if (doGit.toLowerCase() === 'y' || doGit.toLowerCase() === 'yes') {
    step('Creating git commit and tag...')
    execSync('git add package.json Cargo.toml', { cwd: rootDir, stdio: 'inherit' })
    execSync(`git commit -m "chore: release v${targetVersion}"`, { cwd: rootDir, stdio: 'inherit' })
    execSync(`git tag v${targetVersion}`, { cwd: rootDir, stdio: 'inherit' })
  }

  const doPublish = await prompt(rl, '\nRun npm publish? (y/n) ')
  if (doPublish.toLowerCase() === 'y' || doPublish.toLowerCase() === 'yes') {
    step('Publishing to npm...')
    execSync('npm publish', { cwd: rootDir, stdio: 'inherit' })
  }

  rl.close()
  console.log('\nDone.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
