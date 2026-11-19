#!/usr/bin/env node
/**
 * Build dist/noksha-{version}.zip with forward-slash paths only.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const distignorePath = path.join(root, '.distignore');

function readVersion() {
  const php = fs.readFileSync(path.join(root, 'noksha.php'), 'utf8');
  const match = php.match(/^\s*\*\s*Version:\s*([0-9.]+)/m) || php.match(/define\(\s*'NOKSHA_VERSION'\s*,\s*'([^']+)'\s*\)/);
  if (!match) {
    throw new Error('Could not read version from noksha.php');
  }
  return match[1];
}

function readStableTag() {
  const readme = fs.readFileSync(path.join(root, 'readme.txt'), 'utf8');
  const match = readme.match(/^Stable tag:\s*([0-9.]+)/m);
  if (!match) {
    throw new Error('Could not read Stable tag from readme.txt');
  }
  return match[1];
}

function loadIgnores() {
  if (!fs.existsSync(distignorePath)) {
    return [];
  }
  return fs
    .readFileSync(distignorePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

function shouldIgnore(relPosix, ignores) {
  const base = path.posix.basename(relPosix);
  for (const rule of ignores) {
    if (rule === relPosix || rule === base) {
      return true;
    }
    if (rule.endsWith('/') && (relPosix === rule.slice(0, -1) || relPosix.startsWith(rule))) {
      return true;
    }
    if (rule.includes('*')) {
      const re = new RegExp('^' + rule.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
      if (re.test(base) || re.test(relPosix)) {
        return true;
      }
    }
    if (relPosix === rule || relPosix.startsWith(rule + '/')) {
      return true;
    }
  }
  return false;
}

function walk(dir, base, ignores, out) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const rel = path.relative(base, abs).split(path.sep).join('/');
    if (shouldIgnore(rel, ignores)) {
      continue;
    }
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      walk(abs, base, ignores, out);
    } else if (stat.isFile()) {
      out.push({ abs, rel });
    }
  }
}

async function main() {
  const version = readVersion();
  const stable = readStableTag();
  if (version !== stable) {
    throw new Error(`Version mismatch: noksha.php=${version}, readme Stable tag=${stable}`);
  }

  let archiver;
  try {
    archiver = require('archiver');
  } catch (err) {
    throw new Error('Install archiver first: npm install --save-dev archiver');
  }

  fs.mkdirSync(distDir, { recursive: true });
  const zipPath = path.join(distDir, `noksha-${version}.zip`);
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  const ignores = loadIgnores().concat(['dist']);
  const files = [];
  walk(root, root, ignores, files);

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    for (const file of files) {
      // Always forward slashes inside the zip.
      archive.file(file.abs, { name: 'noksha/' + file.rel });
    }
    archive.finalize();
  });

  // Verify: no backslash in any entry name.
  const listing = execFileSync(
    process.platform === 'win32' ? 'powershell' : 'unzip',
    process.platform === 'win32'
      ? ['-NoProfile', '-Command', `Add-Type -AssemblyName System.IO.Compression.FileSystem; $z=[IO.Compression.ZipFile]::OpenRead('${zipPath.replace(/'/g, "''")}'); $z.Entries | ForEach-Object { $_.FullName }; $z.Dispose()`]
      : ['-Z1', zipPath],
    { encoding: 'utf8' }
  );
  const entries = listing.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bad = entries.filter((name) => name.includes('\\'));
  if (bad.length) {
    throw new Error('Zip contains backslash paths:\n' + bad.slice(0, 10).join('\n'));
  }
  if (!entries.some((name) => name === 'noksha/noksha.php' || name.replace(/\\/g, '/') === 'noksha/noksha.php')) {
    // On Windows ZipFile may still report \, but we asserted none above — check forward form.
    const normalized = entries.map((n) => n.replace(/\\/g, '/'));
    if (!normalized.includes('noksha/noksha.php')) {
      throw new Error('Zip missing noksha/noksha.php');
    }
  }

  console.log(JSON.stringify({
    zip: zipPath,
    version,
    files: files.length,
    bytes: fs.statSync(zipPath).size,
    ok: true,
  }, null, 2));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
