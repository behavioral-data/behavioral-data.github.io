import { matchesPerson } from './publications.mjs';

// An explicit list, including [], always takes precedence over legacy name matching.
export function paperBelongsTo(paper, person) {
  return Array.isArray(paper.personIds) ? paper.personIds.includes(person.id) : [person.name, ...(person.aliases || [])].some(name => matchesPerson(paper, name));
}
export function awardsFor(awards, field, id) {
  return awards.filter(award => (award[field] || []).includes(id));
}
export function decoratePapers(papers, awards) {
  return papers.map(paper => ({ ...paper,
    award: [...new Set([paper.award, ...awardsFor(awards, 'publicationIds', paper.id).map(a => a.title)].filter(Boolean))].join('; '),
  })).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}
export function openOpportunities(opportunities, today = new Date().toISOString().slice(0, 10)) {
  return opportunities.filter(o => o.status === 'open' && (!o.closesOn || o.closesOn >= today));
}

export function relatedNews(news, field, id, { awards = [], projects = [] } = {}) {
  return news.filter(n => n[field]?.includes(id)
    || awards.some(a => n.awardIds?.includes(a.id) && a[field]?.includes(id))
    || projects.some(p => n.projectIds?.includes(p.id) && p[field]?.includes(id)));
}
