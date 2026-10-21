import {defineConfig} from 'vite';
import {rmSync} from 'node:fs';
import {resolve} from 'node:path';

// GitHub Pages uses /little-move/; local development stays at /.
export default defineConfig({
 base: process.env.DEPLOY_BASE || '/',
 plugins: [{
  name: 'exclude-unused-private-assets',
  writeBundle(options) {
   const output=resolve(options.dir || 'dist');
   // These files can remain in the local archive, but never in a web deployment.
   for (const file of ['type-studies/portrait-cutout.webp','type-studies/portrait-demo.png',
    'demo-photos/mountains.jpg','demo-photos/forest.jpg','demo-photos/coast.jpg']) {
    rmSync(resolve(output,file),{force:true});
   }
  },
 }],
});
