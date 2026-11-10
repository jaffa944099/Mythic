import {readFile,writeFile} from 'node:fs/promises';
// Keep a complete entry point for Cloudflare's repository-root / no-build mode.
// Asset paths point to the canonical src/ files; the dist build stays unchanged.
export async function syncRootEntry(){
 const html=await readFile('src/index.html','utf8');
 await writeFile('index.html',html.replaceAll('href="assets/','href="src/assets/').replaceAll('src="assets/','src="src/assets/').replace('href="styles.css"','href="src/styles.css"').replace('src="app.js"','src="src/app.js"'));
 await writeFile('_headers',await readFile('src/_headers'));
 await writeFile('404.html',(await readFile('src/404.html','utf8')).replace('href="/styles.css"','href="/src/styles.css"'));
}
