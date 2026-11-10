import {cp,mkdir,rm} from 'node:fs/promises';
import {syncRootEntry} from './sync-entry.mjs';
await syncRootEntry();
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('src','dist',{recursive:true});
console.log('Built static site → dist/; synchronized repository-root entry point');
