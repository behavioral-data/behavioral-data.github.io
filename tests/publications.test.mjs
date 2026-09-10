import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { filterPapers, matchesPerson, bibtex, displayVenue } from '../lib/publications.mjs';
const migratedPapers = JSON.parse(
  fs.readFileSync(new URL('../content/publications.json', import.meta.url)),
);
const papers = [
  {
    id: 'blade',
    title: 'BLADE: Data-driven science',
    authors: 'Gu, Ken and Althoff, Tim',
    year: 2024,
    venue: 'EMNLP',
    description: 'Language model agents',
    award: '',
  },
  {
    id: 'empathy',
    title: 'Supporting conversations',
    authors: 'Sharma, Ashish and Lin, Inna W',
    year: 2021,
    venue: 'WWW',
    description: 'Peer support',
    award: 'Best Paper',
  },
];
test('keyword matching includes venue and description, ignores case and whitespace', () => {
  assert.deepEqual(
    filterPapers(papers, { query: '  EMNLP   agents ' }).map((p) => p.id),
    ['blade'],
  );
});
test('year, author and award filters combine rather than replace each other', () => {
  assert.equal(
    filterPapers(papers, { year: '2024', author: 'Ken Gu', awardsOnly: true }).length,
    0,
  );
  assert.equal(
    filterPapers(papers, { year: '2021', author: 'Inna Lin', awardsOnly: true }).length,
    1,
  );
});
test('names match reversed bibliography ordering and middle initials', () => {
  assert.ok(matchesPerson(papers[0], 'Ken Gu'));
  assert.ok(matchesPerson(papers[1], 'Inna Lin'));
  assert.equal(matchesPerson(papers[0], 'Kenny Gu'), false);
});
test('empty filters restore the complete archive and unknown terms return no results', () => {
  assert.equal(filterPapers(papers).length, 2);
  assert.equal(filterPapers(papers, { query: 'zzzz' }).length, 0);
});
test('a first name and last name from different authors do not create a match', () => {
  assert.equal(matchesPerson({ authors: 'Ken Smith and Alex Gu' }, 'Ken Gu'), false);
});
test('citation retains identifier and capitalization braces', () => {
  const value = bibtex({ ...papers[0], title: '{BLADE}', doi: '10.1234/test' });
  assert.match(value, /@inproceedings\{blade/);
  assert.match(value, /title = \{\{BLADE\}\}/);
  assert.match(value, /doi = \{10.1234\/test\}/);
});
test('citation escapes special characters in migrated records without losing title protection', () => {
  const ampersand = bibtex(migratedPapers.find((p) => p.id === 'liupaths2020'));
  const protectedTitle = bibtex(migratedPapers.find((p) => p.id === 'althoff2016counseling'));
  assert.match(ampersand, /Decision Points \\& Selective Reporting/);
  assert.match(protectedTitle, /Counseling Conversations: \{An\} Application/);
  const escaped = bibtex({
    ...papers[0],
    title: String.raw`A & B_1 is 50% #1 at $5 on C:\tmp ~ ^`,
  });
  assert.ok(
    escaped.includes(
      String.raw`A \& B\_1 is 50\% \#1 at \$5 on C:\textbackslash{}tmp \textasciitilde{} \textasciicircum{}`,
    ),
  );
});

test('short venue labels support unified filtering and search while citations retain full names', () => {
  const full = 'Proceedings of the International AAAI Conference on Web and Social Media';
  const records = [
    { ...papers[0], id: 'full', venue: full },
    { ...papers[0], id: 'short', venue: 'ICWSM' },
  ];
  assert.equal(displayVenue(records[0]), 'ICWSM');
  assert.equal(filterPapers(records, { venue: 'ICWSM', query: 'icwsm' }).length, 2);
  assert.equal(filterPapers(records, { query: 'International AAAI' }).length, 1);
  assert.ok(bibtex(records[0]).includes(full));
  const journal = { ...papers[0], venue: 'Proceedings of the ACM on Human-Computer Interaction' };
  assert.equal(displayVenue(journal), journal.venue);
  assert.equal(displayVenue({ ...journal, venueShort: 'CSCW' }), 'CSCW');
});
