// Optional developer comparison only. Serves exactly one approved HTML on localhost.
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
const args=process.argv.slice(2),i=args.indexOf('--source');
if(i<0||!args[i+1])throw Error('Usage: node scripts/serve-study-reference.mjs --source /absolute/path/type-motion-lab.html');
const file=path.resolve(args[i+1]);if(!fs.statSync(file).isFile())throw Error('Reference must be an HTML file.');
http.createServer((req,res)=>{res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:3108');res.setHeader('Content-Type','text/html; charset=utf-8');if(req.url!=='/reference'){res.statusCode=404;res.end();return;}res.end(fs.readFileSync(file));}).listen(3110,'127.0.0.1',()=>console.log('Reference comparison: http://127.0.0.1:3108/scripts/study-review.html'));
