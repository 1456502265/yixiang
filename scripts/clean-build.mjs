import { realpath, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// 只允许删除当前项目的 dist，拒绝清理符号链接指向的其他目录。
const projectRoot = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(projectRoot, 'dist');
if (dirname(output) !== projectRoot) throw new Error('Build output must be inside the project.');

try {
  const resolvedOutput = await realpath(output);
  if (resolvedOutput !== output) throw new Error('Refusing to clean a redirected build directory.');
  await rm(output, { recursive: true, force: true });
  console.log('Cleared old build output: dist');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
