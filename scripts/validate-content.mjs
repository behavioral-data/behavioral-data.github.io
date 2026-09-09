import fs from 'node:fs';
import path from 'node:path';
import { collections, validateContent } from '../lib/content-validation.mjs';
const data = Object.fromEntries([...collections, 'site', 'pages'].map(name => [name, JSON.parse(fs.readFileSync(`content/${name}.json`, 'utf8'))]));
const errors = validateContent(data, value => { try { return fs.statSync(path.join('public', value)).isFile(); } catch { return false; } });
if (errors.length) { console.error(errors.join('\n'));process.exit(1); }
console.log(`Validated ${collections.map(n => `${data[n].length} ${n}`).join(', ')}, relationships and assets.`);
