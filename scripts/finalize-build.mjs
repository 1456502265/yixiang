import { readFile, writeFile } from 'node:fs/promises';

// Publish the configured headers unchanged; scripts no longer require CSP hashes.
await writeFile('dist/_headers', await readFile('public/_headers', 'utf8'));
console.log('Copied configured response headers to dist.');
