import { readFile, writeFile } from 'node:fs/promises';
import { relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { walk } from './lib/files.mjs';

// 为每页内联脚本生成精确 CSP 哈希，不开放任意内联 JavaScript。
const files = (await walk('dist')).filter(file => file.endsWith('.html'));
const base = await readFile('public/_headers', 'utf8');
const basePolicy = /^  Content-Security-Policy: (.+)$/m.exec(base)?.[1];
if (!basePolicy) throw new Error('Missing base Content-Security-Policy');
const rules = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = '/' + relative('dist', file).split(sep).join('/').replace(/index\.html$/, '');
  const hashes = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
  const policy = basePolicy.replace(/script-src ([^;]+);/, (_, sources) => `script-src ${sources} ${[...new Set(hashes)].join(' ')};`);
  // Cloudflare 在匹配多条规则时会合并同名 header，先移除通用策略再设定本页策略。
  rules.push(`${route}\n  ! Content-Security-Policy\n  Content-Security-Policy: ${policy}`);
}
await writeFile('dist/_headers', base + '\n# Generated page-specific inline script hashes\n\n' + rules.join('\n\n') + '\n');
console.log(`Finalized CSP for ${files.length} static pages.`);
