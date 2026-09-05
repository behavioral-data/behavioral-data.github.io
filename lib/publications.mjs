export function matchesPerson(paper, name) {
  const words = name.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const names = paper.authorNames || paper.authors.split(/\s+and\s+/);
  return words.length > 0 && names.some(name => {
    const author = new Set(name.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
    return words.every(word => author.has(word));
  });
}
export function filterPapers(papers, { query = '', year = '', author = '', person = null, topic = '', venue = '', type = '', awardsOnly = false } = {}) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return papers.filter(p => (!year || String(p.year) === year)
    && (!person ? (!author || matchesPerson(p, author)) : (Array.isArray(p.personIds) ? p.personIds.includes(person.id) : matchesPerson(p, person.name))) && (!topic || p.topics?.includes(topic)) && (!venue || p.venue === venue) && (!type || p.type === type) && (!awardsOnly || !!p.award)
    && terms.every(term => `${p.title} ${p.authors} ${p.venue} ${p.description} ${p.award} ${(p.topics || []).join(' ')}`.toLocaleLowerCase().includes(term)));
}
export function bibtex(paper) {
  const clean = value => String(value || '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
  const kind = {article:'article',conference:'inproceedings',preprint:'misc',book:'book',dataset:'misc',other:'misc'}[paper.type] || (paper.legacy?.journal ? 'article' : 'inproceedings');
  const venueField = kind === 'article' ? 'journal' : kind === 'inproceedings' ? 'booktitle' : 'howpublished';
  const fields = { title: paper.title, author: paper.authorNames?.join(' and ') || paper.authors, year: paper.year,
    ...(paper.venue ? { [venueField]: paper.venue } : {}), ...(paper.doi ? { doi: paper.doi } : {}),
    ...(paper.arxivId ? { eprint: paper.arxivId, archivePrefix: 'arXiv' } : {}),
  };
  return `@${kind}{${paper.id},\n${Object.entries(fields).map(([key, value]) => `  ${key} = {${clean(value)}}`).join(',\n')}\n}`;
}
