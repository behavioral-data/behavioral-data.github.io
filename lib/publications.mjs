const venueLabels = {
  'Proceedings of the International AAAI Conference on Web and Social Media': 'ICWSM',
  'Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)':
    'ACL',
  'Conference on Health, Inference, and Learning': 'CHIL',
  'ACM IMWUT': 'IMWUT',
  'arXiv (Cornell University)': 'arXiv',
  'ICLR 2026': 'ICLR',
  'ICLR 2026 Workshop on Recursive Self-Improvement': 'ICLR Workshop: Recursive Self-Improvement',
};
export function displayVenue(paper) {
  return paper.venueShort || venueLabels[paper.venue] || paper.venue || 'Publication';
}

export function matchesPerson(paper, name) {
  const words = name.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const names = paper.authorNames || paper.authors.split(/\s+and\s+/);
  return (
    words.length > 0 &&
    names.some((name) => {
      const author = new Set(name.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
      return words.every((word) => author.has(word));
    })
  );
}

// An explicit list, including [], always takes precedence over legacy name matching.
export function paperBelongsTo(paper, person) {
  if (Array.isArray(paper.personIds)) return paper.personIds.includes(person.id);
  return [person.name, ...(person.aliases || [])].some((name) => matchesPerson(paper, name));
}

export function filterPapers(
  papers,
  {
    query = '',
    year = '',
    author = '',
    person = null,
    topic = '',
    venue = '',
    type = '',
    awardsOnly = false,
  } = {},
) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return papers.filter(
    (p) =>
      (!year || String(p.year) === year) &&
      (person ? paperBelongsTo(p, person) : !author || matchesPerson(p, author)) &&
      (!topic || p.topics?.includes(topic)) &&
      (!venue || p.venue === venue || displayVenue(p) === venue) &&
      (!type || p.type === type) &&
      (!awardsOnly || !!p.award) &&
      terms.every((term) =>
        `${p.title} ${p.authors} ${p.venue} ${displayVenue(p)} ${p.description} ${p.award} ${(p.topics || []).join(' ')}`
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
}
export function bibtex(paper) {
  const replacements = {
    '\\': '\\textbackslash{}',
    '&': '\\&',
    '%': '\\%',
    $: '\\$',
    '#': '\\#',
    _: '\\_',
    '~': '\\textasciitilde{}',
    '^': '\\textasciicircum{}',
  };
  const clean = (value) =>
    String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[\\&%$#_~^]/g, (character) => replacements[character]);
  const kind =
    {
      article: 'article',
      conference: 'inproceedings',
      preprint: 'misc',
      book: 'book',
      dataset: 'misc',
      other: 'misc',
    }[paper.type] || (paper.legacy?.journal ? 'article' : 'inproceedings');
  const venueField =
    kind === 'article' ? 'journal' : kind === 'inproceedings' ? 'booktitle' : 'howpublished';
  const fields = {
    title: paper.title,
    author: paper.authorNames?.join(' and ') || paper.authors,
    year: paper.year,
    ...(paper.venue ? { [venueField]: paper.venue } : {}),
    ...(paper.doi ? { doi: paper.doi } : {}),
    ...(paper.arxivId ? { eprint: paper.arxivId, archivePrefix: 'arXiv' } : {}),
  };
  return `@${kind}{${paper.id},\n${Object.entries(fields)
    .map(([key, value]) => `  ${key} = {${clean(value)}}`)
    .join(',\n')}\n}`;
}
