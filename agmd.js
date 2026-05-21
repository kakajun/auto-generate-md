#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

function getBinaryPath() {
  const binDir = path.join(__dirname, 'bin');
  const platform = os.platform();
  const targetName = platform === 'win32' ? 'agmd.exe' : 'agmd';
  const targetPath = path.join(binDir, targetName);

  if (fs.existsSync(targetPath)) {
    return targetPath;
  }

  const arch = os.arch();
  const platformMap = { win32: 'windows', darwin: 'macos', linux: 'linux' };
  const archMap = { x64: 'x64', arm64: 'arm64' };
  const p = platformMap[platform];
  const a = archMap[arch];

  if (!p || !a) {
    console.error(`Unsupported platform: ${platform} ${arch}`);
    process.exit(1);
  }

  const ext = platform === 'win32' ? '.exe' : '';
  const binaryName = `agmd-${p}-${a}${ext}`;
  const fallbackPath = path.join(binDir, binaryName);

  if (fs.existsSync(fallbackPath)) {
    return fallbackPath;
  }

  console.error(`Binary not found. Please reinstall agmd.`);
  process.exit(1);
}

const binaryPath = getBinaryPath();
const args = process.argv.slice(2);

const child = spawn(binaryPath, args, {
  stdio: 'inherit',
  shell: false,
});

child.on('error', (err) => {
  console.error('Failed to start agmd:', err.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
