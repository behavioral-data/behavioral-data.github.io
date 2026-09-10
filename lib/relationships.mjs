export { paperBelongsTo } from './publications.mjs';

export function awardsFor(awards, field, id) {
  return awards.filter((award) => (award[field] || []).includes(id));
}
export function latestAwardPapers(papers, awards, limit = 2) {
  const awardDates = new Map();
  for (const award of awards) {
    for (const id of award.publicationIds || []) {
      if (award.date > (awardDates.get(id) || '')) awardDates.set(id, award.date);
    }
  }
  return papers
    .filter((paper) => awardDates.has(paper.id))
    .sort(
      (a, b) =>
        awardDates.get(b.id).localeCompare(awardDates.get(a.id)) || a.title.localeCompare(b.title),
    )
    .slice(0, limit);
}
export function latestPeopleAwards(awards, limit = 2) {
  return awards
    .filter(
      (award) =>
        !award.publicationIds?.length &&
        award.kind !== 'team' &&
        (award.personIds?.length || award.recipientNames?.length),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    .filter((award, index) => index < limit || award.highlight === true);
}
export function decoratePapers(papers, awards) {
  return papers
    .map((paper) => ({
      ...paper,
      award: [
        ...new Set(
          [
            paper.award,
            ...awardsFor(awards, 'publicationIds', paper.id).map((a) => a.title),
          ].filter(Boolean),
        ),
      ].join('; '),
    }))
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}
export function openOpportunities(opportunities, today = new Date().toISOString().slice(0, 10)) {
  return opportunities.filter((o) => o.status === 'open' && (!o.closesOn || o.closesOn >= today));
}

export function relatedNews(news, field, id, { awards = [], projects = [] } = {}) {
  return news.filter(
    (n) =>
      n[field]?.includes(id) ||
      awards.some((a) => n.awardIds?.includes(a.id) && a[field]?.includes(id)) ||
      projects.some((p) => n.projectIds?.includes(p.id) && p[field]?.includes(id)),
  );
}
