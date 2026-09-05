// Next's static export cannot use server redirects. Preserve legacy .html entry points.
import fs from 'node:fs';
const site = JSON.parse(fs.readFileSync('content/site.json', 'utf8'));
const aliases = { '/aboutwebsite.html': '/aboutwebsite/', '/vacancies.html': '/vacancies/' };
for (const [from, to] of Object.entries(aliases)) {
  if (!fs.existsSync(`out${to}index.html`)) throw new Error(`Missing alias target ${to}`);
  fs.writeFileSync(`out${from}`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="${site.url}${to}"><title>Redirect</title></head><body><a href="${to}">Continue</a></body></html>`);
}
