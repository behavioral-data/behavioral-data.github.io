import test from 'node:test';
import assert from 'node:assert/strict';
import { collections, validateContent, validDate } from '../lib/content-validation.mjs';
import {
  paperBelongsTo,
  decoratePapers,
  awardsFor,
  openOpportunities,
  relatedNews,
  latestAwardPapers,
  latestPeopleAwards,
} from '../lib/relationships.mjs';
import { formatDate } from '../lib/dates.mjs';
import { filterPapers, bibtex } from '../lib/publications.mjs';
function fixture() {
  return {
    ...Object.fromEntries(collections.map((n) => [n, []])),
    pages: Object.fromEntries(
      ['home', 'recruitment', 'idiofid', 'research', 'pictures', 'about'].map((k) => [k, '']),
    ),
    site: {
      name: 'Test',
      url: 'https://example.org',
      repository: 'https://example.org/repo',
      signupUrl: 'https://example.org/signup',
    },
    people: [
      {
        id: 'p1',
        name: 'Ada Example',
        role: 'Researcher',
        status: 'member',
        priority: 1,
        topics: [],
      },
    ],
    publications: [
      {
        id: 'work',
        title: 'Test work',
        authors: 'Ada Example',
        year: 2024,
        personIds: ['p1'],
        doi: '10.1234/example',
      },
    ],
  };
}
test('empty future collections and the minimal content model validate', () =>
  assert.deepEqual(validateContent(fixture()), []));
test('reject dangling award recipients, duplicate DOI, missing assets and credential URLs', () => {
  const data = fixture();
  data.awards = [
    {
      id: 'award',
      title: 'Prize',
      date: '2024-01-01',
      organization: 'Test',
      sourceUrl: 'https://example.org',
      personIds: ['absent'],
    },
  ];
  data.publications.push({
    ...data.publications[0],
    id: 'duplicate',
    doi: 'https://doi.org/10.1234/EXAMPLE',
    image: '/missing',
    url: 'https://user:pass@example.org',
  });
  const errors = validateContent(data, () => false).join('\n');
  assert.match(errors, /unknown personIds/);
  assert.match(errors, /duplicate DOI/);
  assert.match(errors, /invalid asset/);
  assert.match(errors, /without credentials/);
});
test('dates reject impossible calendar days and inverted memberships', () => {
  assert.equal(validDate('2024-02-29'), true);
  assert.equal(validDate('2023-02-29'), false);
  assert.equal(validDate('2024-02-31'), false);
  const data = fixture();
  data.people[0].memberships = [{ start: '2024-06-01', end: '2024-01-01' }];
  assert.match(validateContent(data).join(), /ends before/);
});
test('awards and news accept years without inventing dates; review dates stay exact', () => {
  const data = fixture();
  data.awards = [
    {
      id: 'award',
      title: 'Prize',
      date: '2025',
      organization: 'Test',
      sourceUrl: 'https://example.org',
      publicationIds: ['work'],
    },
  ];
  data.news = [{ id: 'news', headline: 'Prize announcement', date: '2025', awardIds: ['award'] }];
  assert.deepEqual(validateContent(data), []);
  assert.equal(formatDate('2025'), '2025');
  assert.equal(formatDate('2024-02-29'), 'February 29, 2024');
  for (const invalid of ['2025-02', '2025-02-30', '0000', 2025]) {
    data.awards[0].date = invalid;
    assert.ok(validateContent(data).length, String(invalid));
  }
  data.awards[0].date = '2025';
  data.awards[0].reviewedOn = '2025';
  assert.match(validateContent(data).join(), /reviewedOn/);
});
test('paper highlights use award dates, deduplicate papers and ignore individual honors', () => {
  const papers = [
    { id: 'old', title: 'Old', year: 2021, highlight: true },
    { id: 'b', title: 'B', year: 2025 },
    { id: 'new', title: 'New unawarded', year: 2026, highlight: true },
    { id: 'a', title: 'A', year: 2025 },
  ];
  const awards = [
    { publicationIds: ['old'], date: '2026' },
    { publicationIds: ['b', 'a'], date: '2025' },
    { publicationIds: ['b'], date: '2025' },
    { personIds: ['p1'], date: '2026' },
  ];
  assert.deepEqual(
    latestAwardPapers(papers, awards).map((p) => p.id),
    ['old', 'a'],
  );
  assert.deepEqual(
    latestAwardPapers(papers, awards, 1).map((p) => p.id),
    ['old'],
  );
  assert.deepEqual(latestAwardPapers(papers, []), []);
  assert.equal(papers[0].id, 'old');
  const renamed = awards.map((a) => ({ ...a, title: 'Updated award title' }));
  assert.equal(
    latestAwardPapers(decoratePapers(papers, renamed), renamed)[0].award,
    'Updated award title',
  );
});
test('explicit person links override name matching, including an empty list', () => {
  const person = { id: 'p1', name: 'Ada Example' };
  const paper = { authors: 'Ada Example' };
  assert.equal(paperBelongsTo(paper, person), true);
  assert.equal(paperBelongsTo({ ...paper, personIds: [] }, person), false);
  assert.equal(filterPapers([{ ...paper, personIds: [] }], { person }).length, 0);
  assert.equal(paperBelongsTo({ authors: 'Different Name', personIds: ['p1'] }, person), true);
});
test('one award record drives publication badges and related views without duplicate text', () => {
  const awards = [{ id: 'a1', title: 'Prize', personIds: ['p1'], publicationIds: ['work'] }];
  assert.equal(
    decoratePapers([{ id: 'work', title: 'Test', year: 2024, award: 'Prize' }], awards)[0].award,
    'Prize',
  );
  assert.equal(awardsFor(awards, 'personIds', 'p1').length, 1);
});
test('explicit attribution combines with topic, venue and type filters', () => {
  const paper = {
    id: 'x',
    title: 'Test',
    authors: 'Different Name',
    year: 2024,
    personIds: ['p1'],
    topics: ['Health'],
    venue: 'CHI',
    type: 'conference',
  };
  assert.equal(
    filterPapers([paper], {
      person: { id: 'p1', name: 'Ada Example' },
      topic: 'Health',
      venue: 'CHI',
      type: 'conference',
    }).length,
    1,
  );
  assert.equal(filterPapers([paper], { person: { id: 'p2', name: 'Different Name' } }).length, 0);
});
test('closed and expired opportunities are hidden while closing-day listings stay visible', () => {
  const rows = [
    { id: 'a', status: 'open', closesOn: '2025-01-01' },
    { id: 'b', status: 'closed' },
    { id: 'c', status: 'open', closesOn: '2025-01-02' },
  ];
  assert.deepEqual(
    openOpportunities(rows, '2025-01-02').map((o) => o.id),
    ['c'],
  );
});

test('award and project news reaches related profiles without duplicate events', () => {
  const news = [{ id: 'n', awardIds: ['a'], projectIds: ['p'] }];
  assert.equal(
    relatedNews(news, 'personIds', 'person', {
      awards: [{ id: 'a', personIds: ['person'] }],
      projects: [{ id: 'p', personIds: ['person'] }],
    }).length,
    1,
  );
  assert.equal(relatedNews(news, 'personIds', 'other').length, 0);
});

test('article, conference and preprint types produce correct citation entries without legacy fields', () => {
  assert.match(
    bibtex({
      id: 'a',
      type: 'article',
      title: 'Test',
      authors: 'Ada',
      year: 2024,
      venue: 'Journal',
    }),
    /^@article/,
  );
  assert.match(
    bibtex({
      id: 'c',
      type: 'conference',
      title: 'Test',
      authors: 'Ada',
      year: 2024,
      venue: 'Proceedings',
    }),
    /^@inproceedings/,
  );
  assert.match(
    bibtex({
      id: 'p',
      type: 'preprint',
      title: 'Test',
      authors: 'Ada',
      year: 2024,
      arxivId: '2401.12345',
    }),
    /archivePrefix = \{arXiv\}/,
  );
});

test('name aliases preserve legacy attribution without overriding explicit person links', () => {
  const person = { id: 'deniznazarova', name: 'Deniz Nazar', aliases: ['Deniz Nazarova'] };
  const paper = { title: 'Test', authors: 'Deniz Nazarova', year: 2024 };
  assert.equal(paperBelongsTo(paper, person), true);
  assert.equal(filterPapers([paper], { person }).length, 1);
  assert.equal(paperBelongsTo({ ...paper, personIds: [] }, person), false);
});

test('people highlights exclude paper and team awards and select the latest honors', () => {
  const awards = [
    { id: 'old', date: '2024', title: 'Older honor', personIds: ['p'] },
    { id: 'team', date: '2026', title: 'Team honor', kind: 'team', personIds: ['p'] },
    { id: 'paper', date: '2026', title: 'Paper prize', personIds: ['p'], publicationIds: ['work'] },
    { id: 'latest', date: '2026', title: 'Fellowship', personIds: ['p'] },
    { id: 'alumnus', date: '2025', title: 'Research honor', recipientNames: ['Alumnus'] },
  ];
  assert.deepEqual(
    latestPeopleAwards(awards).map((a) => a.id),
    ['latest', 'alumnus'],
  );
  assert.equal(awards[0].id, 'old');
  assert.deepEqual(latestPeopleAwards([]), []);
});
test('awards preserve year ranges and named alumni without fabricated profile links', () => {
  const data = fixture();
  data.awards = [
    {
      id: 'fellowship',
      title: 'Fellowship',
      organization: 'University',
      date: '2025',
      dateLabel: '2025–2026',
      recipientNames: ['Alumnus'],
      sourceUrl: 'https://example.org/award',
    },
  ];
  assert.deepEqual(validateContent(data), []);
  data.awards[0].dateLabel = '2024–2026';
  assert.match(validateContent(data).join(), /dateLabel/);
  data.awards[0].dateLabel = '2025–2024';
  assert.match(validateContent(data).join(), /dateLabel/);
  data.awards[0].dateLabel = '2025–2026';
  data.awards[0].recipientNames = [''];
  assert.match(validateContent(data).join(), /recipientNames/);
});
