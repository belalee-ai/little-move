import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {EFFECTS} from '../src/motion-core.js';
import {STUDIES} from '../src/studies/catalog.js';
import {DEMOS} from '../src/demos/catalog.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const intake = path.join(root, 'docs/intake');
const input = JSON.parse(fs.readFileSync(path.join(intake, 'candidates.json'), 'utf8'));
const policy = JSON.parse(fs.readFileSync(path.join(intake, 'policy.json'), 'utf8'));
const args = process.argv.slice(2);
const at = args.indexOf('--file');
if (at >= 0 && (!args[at + 1] || args[at + 1].startsWith('--'))) {
  throw Error('--file 后须提供候选 JSON 文件路径');
}
const extra = at >= 0 ? JSON.parse(fs.readFileSync(path.resolve(args[at + 1]), 'utf8')) : [];
const extraRows = Array.isArray(extra) ? extra : extra.candidates;
if (!Array.isArray(input.candidates) || !Array.isArray(extraRows)) throw Error('候选须为数组或含 candidates 数组的 JSON');
if (!Number.isInteger(policy.scheduler.intervalDays) || policy.scheduler.intervalDays < 1) throw Error('更新间隔须为正整数天');
if (typeof policy.scheduler.enabled !== 'boolean') throw Error('调度状态须为布尔值');
if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(policy.scheduler.localTime)) throw Error('运行时间须为 HH:mm');
new Intl.DateTimeFormat('en', {timeZone: policy.scheduler.timeZone});
if (policy.quantityLimit !== null || policy.minimumAccepted !== 0) throw Error('本项目每批不限量，且不设最低新增数');
if (!['local-review', 'auto-publish'].includes(policy.publishMode)) throw Error('未知发布模式');
if (!Array.isArray(policy.qualityGates) || !policy.qualityGates.length) throw Error('须声明质量门槛');

const catalog = [...EFFECTS, ...STUDIES, ...DEMOS];
const codes = catalog.map(x => Number(x.code));
if (codes.some(x => !Number.isInteger(x) || x < 1) || new Set(codes).size !== codes.length) throw Error('正式目录编号无效或重复');
const known = new Set(catalog.map(x => x.signature).filter(Boolean));
const names = new Set(catalog.map(x => x.name.trim()));
const seen = new Set();
const kept = [];
const duplicates = [];
for (const c of [...input.candidates, ...extraRows]) {
  for (const field of ['key', 'name', 'signature', 'source', 'collection', 'license']) {
    if (typeof c[field] !== 'string' || !c[field].trim()) throw Error('候选缺少有效字段：' + field);
  }
  if (new URL(c.source).protocol !== 'https:') throw Error('来源须为 HTTPS URL');
  if (!['discovered', 'verified', 'implemented', 'accepted', 'blocked'].includes(c.status)) throw Error('未知候选状态 ' + c.status);
  if (seen.has(c.key) || known.has(c.signature) || names.has(c.name.trim())) {
    duplicates.push(c.key);
    continue;
  }
  seen.add(c.key);
  known.add(c.signature);
  names.add(c.name.trim());
  kept.push(c);
}
const report = {
  generatedAt: new Date().toISOString(),
  schedule: policy.scheduler.enabled ? 'codex-desktop-heartbeat' : 'manual',
  schedulePolicy: policy.scheduler,
  quantityLimit: policy.quantityLimit,
  minimumAccepted: policy.minimumAccepted,
  publishMode: policy.publishMode,
  implemented: catalog.length,
  categories: new Set(catalog.map(x => x.category)).size,
  nextCode: String(Math.max(0, ...codes) + 1).padStart(3, '0'),
  candidates: kept,
  duplicates,
  counts: kept.reduce((r, c) => (r[c.status] = (r[c.status] ?? 0) + 1, r), {}),
  note: '脚本只盘点字段、编号和显式特征；语义去重、来源许可、真实预览和质量验收由维护者执行。配置描述维护安排，不启动调度、不检索网络、不修改网站、不发布。定时运行由维护者的 Codex App 配置。',
};
if (!args.includes('--check')) fs.writeFileSync(path.join(intake, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({implemented: report.implemented, categories: report.categories, nextCode: report.nextCode, candidates: kept.length, duplicates, schedule: report.schedule, intervalDays: policy.scheduler.intervalDays, quantityLimit: report.quantityLimit, publishMode: report.publishMode, reportWritten: !args.includes('--check')}, null, 2));
