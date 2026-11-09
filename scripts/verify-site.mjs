import { readFile, access } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { walk } from './lib/files.mjs';
import { siteUrl } from '../src/config/domain.mjs';

const root = resolve('dist');
const files = (await walk(root)).filter(file => file.endsWith('.html'));
const errors = [];
const titles = new Set();
const descriptions = new Set();
const origin = siteUrl;
const headers = await readFile(resolve(root, '_headers'), 'utf8');
const sitemap = await readFile(resolve(root, 'sitemap-0.xml'), 'utf8');
const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${origin}/sitemap-index.xml`)) errors.push('robots.txt sitemap does not match configured site domain');
const docs = JSON.parse(await readFile('src/data/help.json', 'utf8'));
const internalChecks = [];
const htmlMap = new Map();
const report = (file, message) => errors.push(`${relative(root, file)}: ${message}`);
const routeOf = file => '/' + relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
const tagManagerSrc = 'https://www.googletagmanager.com/gtm.js?id=GTM-MP9WBHRK';
const tagManagerInit = `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});`;
for (const file of files) htmlMap.set(file, await readFile(file, 'utf8'));

for (const [file, html] of htmlMap) {
  const route = routeOf(file);
  const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
  const description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1];
  if (!title || titles.has(title)) report(file, 'missing or duplicated title');
  if (!description || descriptions.has(description)) report(file, 'missing or duplicated description');
  titles.add(title); descriptions.add(description);
  if ((html.match(/<h1\b/g)||[]).length !== 1) report(file, 'expected exactly one h1');
  if (!html.includes('lang="zh-CN"')) report(file, 'missing Chinese language');
  if (!html.includes(`<link rel="canonical" href="${origin}${route}"`)) report(file, 'incorrect canonical');
  if (/\?{3,}|example\.com|vpn\.cyscar|javascript:|wp-includes|wp-content|hm\.baidu|仍要运行|银行级/.test(html)) report(file, 'placeholder, inherited script or unsafe instruction');
  if (html.split(`src="${tagManagerSrc}"`).length !== 2) report(file, 'expected exactly one configured GTM loader');
  if (html.split('id="google-tag-manager-init"').length !== 2) report(file, 'expected exactly one GTM initializer');
  const noindex = html.includes('noindex, follow');
  if (!noindex && !sitemap.includes(`<loc>${origin}${route}</loc>`)) report(file, 'missing from sitemap');
  if (noindex && sitemap.includes(`<loc>${origin}${route}</loc>`)) report(file, 'noindex page included in sitemap');
  if (route === '/404.html' && (!html.includes('noindex, follow') || sitemap.includes('/404'))) report(file, '404 must be noindex and excluded from sitemap');

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const src = /\bsrc="([^"]+)"/.exec(match[1])?.[1];
    if (src) {
      const allowed = ['/scripts/help-search.js', tagManagerSrc];
      if (!allowed.includes(src)) report(file, `unexpected executable script ${src}`);
      if (src === tagManagerSrc && !/\basync\b/.test(match[1])) report(file, 'GTM loader must be async');
    } else {
      if (match[1].includes('application/ld+json')) {
        try { const data=JSON.parse(match[2]); if (!data['@graph']?.length) report(file, 'missing schema graph'); } catch { report(file, 'invalid JSON-LD'); }
      } else if (!match[1].includes('id="google-tag-manager-init"') || match[2].trim() !== tagManagerInit) {
        report(file, 'unexpected executable inline script');
      }
    }
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!href || href === '#' || /^(?:javascript:|http:|\/\/)/i.test(href)) { report(file, `unsafe or empty link ${href}`); continue; }
    if (/^(?:mailto:|tel:)/.test(href)) continue;
    let url; try {url = new URL(href, origin + route);} catch {report(file, `invalid URL ${href}`);continue;}
    if (url.origin !== origin) continue;
    let target = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target = resolve(target, 'index.html');
    if (relative(root, target).startsWith('..')) {report(file, `out-of-root reference ${href}`);continue;}
    internalChecks.push((async()=>{
      try { await access(target); } catch {report(file, `missing local target ${href}`);return;}
      if (url.hash && htmlMap.has(target)) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (!htmlMap.get(target).includes(`id="${id}"`)) report(file, `missing anchor ${href}`);
      }
    })());
  }
  for (const match of html.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\balt="[^"]*"/.test(match[1])) report(file, 'image missing alt');
    if (!/\bwidth="/.test(match[1]) || !/\bheight="/.test(match[1])) report(file, 'image missing explicit dimensions');
  }
}
await Promise.all(internalChecks);
for (const doc of docs) if (!htmlMap.has(resolve(root, 'help', doc.slug, 'index.html'))) errors.push(`Missing migrated help route ${doc.slug}`);
const redirects = await readFile(resolve(root, '_redirects'), 'utf8');
if (!redirects.includes('/price1/ /price/ 301')) errors.push('Missing old price URL redirect');
if (headers.split('\n').some(line => line.length > 2000)) errors.push('Cloudflare header line exceeds 2000 characters');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Verified ${files.length} pages: titles, descriptions, canonical URLs, sitemap, JSON-LD, local links/assets, anchors, image attributes and ${docs.length} retained help routes.`);
