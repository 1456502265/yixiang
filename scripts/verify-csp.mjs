import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://127.0.0.1:8787';
const fetchLocal = (path, options) => fetch(new URL(path, origin), options);
const checkHtml = async (path, status = 200, options) => {
  const response = await fetchLocal(path, options);
  assert.equal(response.status, status, path);
  const policy = response.headers.get('content-security-policy');
  assert(policy, 'Expected remaining CSP protections');
  const directives = new Set(policy.split(';').map(d => d.trim().split(/\s+/)[0]));
  for (const name of ['default-src', 'script-src', 'script-src-elem', 'script-src-attr', 'style-src', 'style-src-elem', 'style-src-attr', 'img-src']) {
    assert(!directives.has(name), name + ' must not restrict scripts, styles or images');
  }
  assert(policy.includes("object-src 'none'"));
  assert(policy.includes("frame-ancestors 'none'"));
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  const html = await response.text();
  assert(!/<script\b[^>]*\bnonce=/.test(html), 'No script nonce rewriting required');
};
await checkHtml('/');
await checkHtml('/help/');
await checkHtml('/missing-csp-check/', 404);
const redirect = await fetchLocal('/price1/', { redirect: 'manual' });
assert.equal(redirect.status, 301);
assert.equal(new URL(redirect.headers.get('location'), origin).pathname, '/price/');
const css = await fetchLocal('/scripts/help-search.js');
assert.equal(css.status, 200);
assert(!css.headers.get('content-security-policy')?.includes("'nonce-"));
const etag = css.headers.get('etag');
assert(etag, 'Static resource must keep its ETag');
const cached = await fetchLocal('/scripts/help-search.js', { headers: { 'If-None-Match': etag } });
assert.equal(cached.status, 304, 'Static resource conditional requests must still work');
console.log('Verified HTTP headers: no script/image/style restrictions or default fallback, remaining protections, 404, redirects and static resource revalidation.');
