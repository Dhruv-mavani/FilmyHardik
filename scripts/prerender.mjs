// Renders the React app to static HTML and injects it into dist/index.html,
// so crawlers, answer engines and AI agents that don't run JavaScript still get the full page.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const ssrEntry = resolve('dist-ssr/entry-server.js');
const { render } = await import(pathToFileURL(ssrEntry).href);
const html = readFileSync('dist/index.html', 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
writeFileSync('dist/index.html', html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
rmSync('dist-ssr', { recursive: true, force: true });
console.log('prerendered dist/index.html');
