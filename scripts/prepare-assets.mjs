import { cp, mkdir } from 'node:fs/promises';

// Keep the runtime independent of a public CDN; these generated files are ignored.
const target = new URL('../public/vendor/vditor/', import.meta.url);
await mkdir(target, { recursive: true });
await cp(new URL('../node_modules/vditor/dist/', import.meta.url), new URL('dist/', target), {
  recursive: true,
});
