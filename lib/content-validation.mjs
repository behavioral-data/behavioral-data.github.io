const idPattern = /^[a-zA-Z0-9_-]+$/;
export const collections = ['publications', 'people', 'news', 'alumni', 'sponsors', 'awards', 'projects', 'opportunities', 'gallery'];
export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
export function validUrl(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password; } catch { return false; }
}
export function validateContent(data, assetExists = () => true) {
  const errors = [];
  const fail = (label, message) => errors.push(`${label}: ${message}`);
  const text = (value, label) => { if (typeof value !== 'string' || !value.trim()) fail(label, 'expected nonempty text'); };
  const date = (value, label) => { if (!validDate(value)) fail(label, 'expected a real YYYY-MM-DD date'); };
  const url = (value, label) => { if (value && !validUrl(value)) fail(label, 'expected an http(s) URL without credentials'); };
  const asset = (value, label, external = false) => {
    if (!value) return;
    if (external && validUrl(value)) return;
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\?#]/.test(value) || value.split('/').includes('..') || !assetExists(value)) fail(label, 'missing or invalid asset');
  };
  const strings = (value, label) => { if (!Array.isArray(value) || value.some(v => typeof v !== 'string' || !v.trim()) || new Set(value).size !== value.length) fail(label, 'expected unique text values'); };
  for (const name of collections) if (!Array.isArray(data[name])) fail(name, 'expected an array');
  if (errors.length) return errors;
  const ids = {};
  for (const name of collections.filter(n => !['alumni','sponsors'].includes(n))) {
    ids[name] = new Set();
    for (const row of data[name]) {
      if (!row || typeof row !== 'object' || Array.isArray(row)) { fail(name, 'expected records'); continue; }
      if (!idPattern.test(row.id || '') || ids[name].has(row.id)) fail(name, `invalid or duplicate ID ${row.id}`);
      ids[name].add(row.id);
    }
  }
  if (errors.length) return errors;
  const refs = (row, field, collection, label = row.id) => {
    if (row[field] === undefined) return;
    strings(row[field], `${label}.${field}`);
    if (Array.isArray(row[field])) for (const id of row[field]) if (!ids[collection].has(id)) fail(label, `unknown ${field} reference ${id}`);
  };
  const common = row => {
    for (const field of ['reviewedOn','reviewOn']) if (row[field]) date(row[field], `${row.id}.${field}`);
    refs(row, 'personIds', 'people'); refs(row, 'publicationIds', 'publications'); refs(row, 'projectIds', 'projects');
    if (row.sourceUrl) url(row.sourceUrl, `${row.id}.sourceUrl`);
  };
  const dois = new Set();
  for (const p of data.publications) {
    for (const field of ['title','authors']) text(p[field], `${p.id}.${field}`);
    if (!Number.isInteger(p.year) || p.year < 1900 || p.year > new Date().getFullYear()+2) fail(p.id, 'invalid year');
    if (p.authorNames !== undefined && (!Array.isArray(p.authorNames) || !p.authorNames.length || p.authorNames.some(v => typeof v !== 'string' || !v.trim()))) fail(p.id, 'expected authorNames');
    asset(p.image, p.id); asset(p.pdf, p.id, true);
    for (const field of ['url','code','dataset']) url(p[field], `${p.id}.${field}`);
    if (p.doi) {
      const doi = p.doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').toLowerCase();
      if (!/^10\.\d{4,9}\/\S+$/.test(doi) || dois.has(doi)) fail(p.id, 'invalid or duplicate DOI');
      dois.add(doi);
    }
    if (p.openalexId && !/^W\d+$/.test(p.openalexId)) fail(p.id, 'invalid OpenAlex work ID');
    if (p.arxivId && !/^(?:\d{4}\.\d{4,5}|[a-z.-]+\/\d{7})(?:v\d+)?$/i.test(p.arxivId)) fail(p.id, 'invalid arXiv ID');
    if (p.status && !['preprint','accepted','published','withdrawn','retracted'].includes(p.status)) fail(p.id, 'invalid publication status');
    if (p.type && !['article','conference','preprint','book','dataset','other'].includes(p.type)) fail(p.id, 'invalid publication type');
    if (p.topics) strings(p.topics, `${p.id}.topics`);
    if (p.highlight !== undefined && typeof p.highlight !== 'boolean') fail(p.id, 'highlight must be boolean');
    common(p);
  }
  for (const p of data.people) {
    for (const field of ['name','role']) text(p[field], `${p.id}.${field}`);
    if (!['member','visitor','alumni'].includes(p.status)) fail(p.id, 'invalid membership status');
    if (!Number.isFinite(p.priority)) fail(p.id, 'priority must be numeric');
    strings(p.topics, `${p.id}.topics`); asset(p.image, p.id); url(p.website, p.id);
    if (p.aliases) strings(p.aliases, `${p.id}.aliases`);
    if (p.memberships !== undefined) {
      if (!Array.isArray(p.memberships)) fail(p.id, 'memberships must be an array');
      else for (const period of p.memberships) {
        date(period.start, p.id); if (period.end) { date(period.end, p.id); if (period.end < period.start) fail(p.id, 'membership ends before it starts'); }
      }
    }
    common(p);
  }
  for (const n of data.news) { text(n.headline, n.id); date(n.date, n.id); common(n); refs(n, 'awardIds', 'awards'); }
  for (const a of data.awards) {
    for (const field of ['title','organization','sourceUrl']) text(a[field], `${a.id}.${field}`);
    date(a.date, a.id); common(a);
    if (!(a.personIds?.length || a.publicationIds?.length)) fail(a.id, 'award needs a recipient or paper');
  }
  for (const p of data.projects) { text(p.title,p.id); url(p.url,p.id); url(p.code,p.id);url(p.dataset,p.id);asset(p.image,p.id);common(p); }
  for (const o of data.opportunities) {
    for (const field of ['title','ownerId','url']) text(o[field], `${o.id}.${field}`);
    if (!ids.people.has(o.ownerId)) fail(o.id, 'unknown ownerId');
    if (!['open','closed','draft'].includes(o.status)) fail(o.id, 'invalid opportunity status');
    date(o.reviewOn, o.id); if (o.closesOn) date(o.closesOn,o.id); url(o.url,o.id);common(o);
  }
  for (const p of data.gallery) { text(p.image,p.id);text(p.alt,p.id);asset(p.image,p.id);if (p.date) date(p.date,p.id);common(p); }
  for (const a of data.alumni) { text(a.name,'alumni');url(a.site,a.name); }
  for (const s of data.sponsors) { text(s.name,'sponsor');text(s.path,s.name);asset(`/resources${s.path}`,s.name);url(s.url,s.name);if (s.reviewOn) date(s.reviewOn,s.name); }
  if (!data.site || typeof data.site !== 'object') fail('site','missing settings');
  else { for (const f of ['url','repository','signupUrl']) { text(data.site[f],`site.${f}`);url(data.site[f],`site.${f}`); } text(data.site.name,'site.name'); }
  if (!data.pages || typeof data.pages !== 'object' || ['home','recruitment','idiofid','research','pictures','about'].some(k => typeof data.pages[k] !== 'string')) fail('pages', 'expected Markdown strings for every page');
  return errors;
}
