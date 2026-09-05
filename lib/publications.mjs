export function matchesPerson(paper, name) {
  const words = name.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const names = paper.authorNames || paper.authors.split(/\s+and\s+/);
  return words.length > 0 && names.some(name => {
    const author = new Set(name.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
    return words.every(word => author.has(word));
  });
}
export function filterPapers(papers, { query = '', year = '', author = '', awardsOnly = false } = {}) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return papers.filter(p => (!year || String(p.year) === year)
    && (!author || matchesPerson(p, author)) && (!awardsOnly || !!p.award)
    && terms.every(term => `${p.title} ${p.authors} ${p.venue} ${p.description} ${p.award}`.toLocaleLowerCase().includes(term)));
}
export function bibtex(paper) {
  const clean = value => String(value || '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
  const fields = { title: paper.title, author: paper.authorNames?.join(' and ') || paper.authors, year: paper.year, ...(paper.legacy?.journal ? { journal: paper.venue } : { booktitle: paper.venue }), ...(paper.doi ? { doi: paper.doi } : {}) };
  return `@${paper.legacy?.journal ? 'article' : 'inproceedings'}{${paper.id},\n${Object.entries(fields).map(([key, value]) => `  ${key} = {${clean(value)}}`).join(',\n')}\n}`;
}
