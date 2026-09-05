import fs from 'node:fs';
import path from 'node:path';
const read = name => JSON.parse(fs.readFileSync(`content/${name}.json`, 'utf8'));
const errors = [];
function required(row, fields, label) { for (const field of fields) if (typeof row[field] !== 'string' || !row[field].trim()) errors.push(`${label}: missing ${field}`); }
function unique(rows, label) { const seen = new Set(); for (const row of rows) { if (seen.has(row.id)) errors.push(`${label}: duplicate ID ${row.id}`); seen.add(row.id); if (!/^[a-zA-Z0-9_-]+$/.test(row.id)) errors.push(`${label}: invalid ID ${row.id}`); } }
function asset(value, label) { if (!value) return; if (!value.startsWith('/') || value.includes('..') || !fs.existsSync(path.join('public',value))) errors.push(`${label}: missing or invalid asset ${value}`); }
function url(value, label) { if (value && !/^https?:\/\//i.test(value)) errors.push(`${label}: expected http(s) URL: ${value}`); }
const papers = read('publications'), people = read('people'), news = read('news');
unique(papers, 'papers'); unique(people, 'people'); unique(news, 'news');
for (const p of papers) {
  required(p,['id','title','authors'],'paper');
  if (!Number.isInteger(p.year) || p.year < 1900 || p.year > new Date().getFullYear()+2) errors.push(`${p.id}: invalid year`);
  asset(p.image,p.id);asset(p.pdf,p.id);url(p.code,p.id);url(p.url,p.id);
}
for (const p of people) {
  required(p,['id','name','role'],'person');asset(p.image,p.id);url(p.website,p.id);
  if (!['member','visitor','alumni'].includes(p.status)) errors.push(`${p.id}: invalid status`);
  if (!Array.isArray(p.topics)) errors.push(`${p.id}: topics must be an array`);
}
for (const n of news) { required(n,['id','headline','date'],'news');if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date) || Number.isNaN(Date.parse(n.date))) errors.push(`${n.id}: invalid date`); }
if (errors.length) { console.error(errors.join('\n'));process.exit(1); }
console.log(`Validated ${papers.length} papers, ${people.length} people, ${news.length} news items and all referenced assets.`);
