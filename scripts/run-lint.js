const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx']);
const INCLUDED_PATHS = [path.join(ROOT, 'tests'), path.join(ROOT, 'scripts')];
const TOP_LEVEL_FILES = [
  'src/api/server.ts',
];

function collectSourceFiles(startDir) {
  const files = [];
  const queue = [...INCLUDED_PATHS.filter((dir) => fs.existsSync(dir))];

  for (const fileName of TOP_LEVEL_FILES) {
    const filePath = path.join(startDir, fileName);
    if (fs.existsSync(filePath)) {
      files.push(filePath);
    }
  }

  while (queue.length > 0) {
    const current = queue.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }

      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        if (['dist', 'coverage', 'build', 'docs', 'node_modules'].includes(entry.name)) {
          continue;
        }
        queue.push(fullPath);
      } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function checkTrailingWhitespace(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const issues = [];

  lines.forEach((line, index) => {
    if (/\s+$/.test(line)) {
      issues.push({ line: index + 1, message: 'Trailing whitespace detected' });
    }
  });

  return issues;
}

function runTypeCheck() {
  execSync('tsc -p tsconfig.api.json --noEmit', {
    stdio: 'inherit',
    cwd: ROOT,
  });
}

function main() {
  const problems = [];
  const files = collectSourceFiles(ROOT);

  for (const file of files) {
    const issues = checkTrailingWhitespace(file);
    issues.forEach((issue) => {
      problems.push(`${path.relative(ROOT, file)}:${issue.line} ${issue.message}`);
    });
  }

  if (problems.length > 0) {
    problems.forEach((problem) => console.error(problem));
    process.exitCode = 1;
    return;
  }

  runTypeCheck();
  console.log('Static analysis completed successfully.');
}

main();
