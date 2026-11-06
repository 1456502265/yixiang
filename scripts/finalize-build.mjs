import { readFile, writeFile } from 'node:fs/promises';
import { relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { walk } from './lib/files.mjs';

// 为每页 JSON-LD 生成精确 CSP 哈希，不开放任意内联 JavaScript。
const files = (await walk('dist')).filter(file => file.endsWith('.html'));
const base = await readFile('public/_headers', 'utf8');
const rules = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = '/' + relative('dist', file).split(sep).join('/').replace(/index\.html$/, '');
  const hashes = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
  const policy = `default-src 'self'; script-src 'self' ${[...new Set(hashes)].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; media-src 'self' https://dpv.videocc.net; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests`;
  // Cloudflare 在匹配多条规则时会合并同名 header，先移除通用策略再设定本页策略。
  rules.push(`${route}\n  ! Content-Security-Policy\n  Content-Security-Policy: ${policy}`);
}
await writeFile('dist/_headers', base + '\n# Generated page-specific JSON-LD hashes\n\n' + rules.join('\n\n') + '\n');
console.log(`Finalized CSP for ${files.length} static pages.`);
