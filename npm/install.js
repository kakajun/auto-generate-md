const fs = require('fs');
const path = require('path');
const os = require('os');

function getBinaryName() {
  const platform = os.platform();
  const arch = os.arch();

  const platformMap = {
    win32: 'windows',
    darwin: 'macos',
    linux: 'linux',
  };

  const archMap = {
    x64: 'x64',
    arm64: 'arm64',
  };

  const p = platformMap[platform];
  const a = archMap[arch];

  if (!p || !a) {
    console.error(`Unsupported platform: ${platform} ${arch}`);
    process.exit(1);
  }

  const ext = platform === 'win32' ? '.exe' : '';
  return `agmd-${p}-${a}${ext}`;
}

function main() {
  const binaryName = getBinaryName();
  const binDir = path.join(__dirname, 'bin');
  const sourcePath = path.join(binDir, binaryName);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Binary not found for your platform: ${binaryName}`);
    console.error('Supported platforms: Linux x64/ARM64, macOS x64/ARM64, Windows x64');
    process.exit(1);
  }

  const targetName = os.platform() === 'win32' ? 'agmd.exe' : 'agmd';
  const targetPath = path.join(binDir, targetName);

  try {
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    fs.copyFileSync(sourcePath, targetPath);
    fs.chmodSync(targetPath, 0o755);
    console.log(`agmd installed: ${binaryName}`);
  } catch (err) {
    console.error('Failed to setup binary:', err.message);
    process.exit(1);
  }
}

main();
