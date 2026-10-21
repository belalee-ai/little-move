import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {EFFECTS} from '../src/motion-core.js';
import {STUDIES} from '../src/studies/catalog.js';
import {DEMOS} from '../src/demos/catalog.js';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const all = [...EFFECTS, ...STUDIES, ...DEMOS];
const count = all.length;
const categories = new Set(all.map(x => x.category)).size;
const dest = path.join(root, 'docs/images');
fs.mkdirSync(dest, {recursive: true});
const font = "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="760" viewBox="0 0 1600 760" role="img" aria-labelledby="title desc">
<title id="title">Little Move · 先看动效，再说需求。</title>
<desc id="desc">${count} 个 Demo、${categories} 个动作分类。覆盖文字、图片与图形、布局、控件和数据，可在线预览、复制提示词、选择音效并调整参数。这是项目介绍图，真实界面见下方截图。</desc>
<rect width="1600" height="760" fill="#f7f6f2"/>
<path d="M0 0H1600" stroke="#20211f" stroke-width="12"/>
<g font-family="${font}" fill="#20211f">
 <rect x="76" y="69" width="48" height="48" rx="13" fill="#20211f"/>
 <path d="M93 82l17 11-17 11z" fill="#f7f6f2"/>
 <text x="143" y="105" font-size="34" font-weight="650" letter-spacing="-1">Little Move</text>
 <text x="77" y="184" font-size="18" fill="#777971" letter-spacing="3">A LIBRARY OF SMALL MOTIONS</text>
 <text x="70" y="292" font-size="76" font-weight="650" letter-spacing="-2">先看动效，</text>
 <text x="70" y="395" font-size="76" font-weight="650" letter-spacing="-2">再说需求。</text>
 <text x="77" y="461" font-size="26" fill="#656860">文字 · 图片与图形 · 布局 · 控件 · 数据</text>
 <g transform="translate(1050 140)">
  <rect x="68" y="7" width="310" height="250" rx="24" fill="#e6e6de" transform="rotate(9 223 132)"/>
  <rect x="24" y="44" width="310" height="250" rx="24" fill="#d9ded5" transform="rotate(-8 179 169)"/>
  <rect y="81" width="330" height="256" rx="24" fill="#fff" stroke="#dfdfd7"/>
  <path d="M43 274 C78 274 77 225 112 225 S151 262 184 221 S227 221 284 155" fill="none" stroke="#343e36" stroke-width="5" stroke-linecap="round"/>
  <circle cx="284" cy="155" r="8" fill="#343e36"/>
  <path d="M44 118H117" stroke="#dadcd5" stroke-width="7" stroke-linecap="round"/>
  <path d="M44 133H83" stroke="#e8e9e4" stroke-width="5" stroke-linecap="round"/>
 </g>
 <path d="M76 531H1524" stroke="#d4d5cd"/>
 <text x="77" y="618" font-size="58" font-weight="600">${count}<tspan dx="12" font-size="22" font-weight="400" fill="#656860">Demos</tspan></text>
 <text x="447" y="618" font-size="58" font-weight="600">${categories}<tspan dx="12" font-size="22" font-weight="400" fill="#656860">动作分类</tspan></text>
 <text x="817" y="590" font-size="27" font-weight="550">看 · 调 · 用</text>
 <text x="817" y="629" font-size="21" fill="#656860">预览 / 调参 / 复制提示词</text>
 <text x="1227" y="590" font-size="27" font-weight="550">声音也能配</text>
 <text x="1227" y="629" font-size="21" fill="#656860">选音色 / 调音量 / 试听</text>
 <path d="M394 567V638M764 567V638M1175 567V638" stroke="#d4d5cd"/>
 <text x="77" y="710" font-size="18" fill="#777971">在线查用 · 固定编号 · React / Remotion 源码复用</text>
 <text x="1523" y="710" text-anchor="end" font-size="18" fill="#777971">little-move</text>
</g></svg>\n`;
fs.writeFileSync(path.join(dest, 'project-intro.svg'), svg);
function badge(file, label, value, width, split, color) {
  const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  fs.writeFileSync(path.join(dest, file), `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="26" role="img" aria-label="${escape(label + ': ' + value)}"><rect width="${width}" height="26" rx="4" fill="${color}"/><path d="M4 0h${split-4}v26H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4" fill="#4b4d49"/><g fill="#fff" font-family="${font}" font-size="12" text-anchor="middle"><text x="${split/2}" y="17.5">${escape(label)}</text><text x="${split+(width-split)/2}" y="17.5">${escape(value)}</text></g></svg>\n`);
}
badge('badge-code.svg', '原创代码', 'MIT', 131, 82, '#3f5947');
badge('badge-catalog.svg', 'Demo', count + ' / ' + categories + ' 类', 158, 56, '#555d69');
badge('badge-preview.svg', '在线体验', '打开', 132, 82, '#3f5947');
console.log('Updated project intro: ' + count + ' demos, ' + categories + ' categories.');
