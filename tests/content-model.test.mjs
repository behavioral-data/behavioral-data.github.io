import test from 'node:test';
import assert from 'node:assert/strict';
import { collections, validateContent, validDate } from '../lib/content-validation.mjs';
import { paperBelongsTo, decoratePapers, awardsFor, openOpportunities, relatedNews } from '../lib/relationships.mjs';
import { filterPapers, bibtex } from '../lib/publications.mjs';
function fixture() {
  return { ...Object.fromEntries(collections.map(n => [n, []])),
    pages: Object.fromEntries(['home','recruitment','idiofid','research','pictures','about'].map(k => [k,''])),
    site: {name:'Test',url:'https://example.org',repository:'https://example.org/repo',signupUrl:'https://example.org/signup'},
    people: [{id:'p1',name:'Ada Example',role:'Researcher',status:'member',priority:1,topics:[]}],
    publications: [{id:'work',title:'Test work',authors:'Ada Example',year:2024,personIds:['p1'],doi:'10.1234/example'}],
  };
}
test('empty future collections and the minimal content model validate', () => assert.deepEqual(validateContent(fixture()), []));
test('reject dangling award recipients, duplicate DOI, missing assets and credential URLs', () => {
  const data=fixture();data.awards=[{id:'award',title:'Prize',date:'2024-01-01',organization:'Test',sourceUrl:'https://example.org',personIds:['absent']}];
  data.publications.push({...data.publications[0],id:'duplicate',doi:'https://doi.org/10.1234/EXAMPLE',image:'/missing',url:'https://user:pass@example.org'});
  const errors=validateContent(data, () => false).join('\n');
  assert.match(errors,/unknown personIds/);assert.match(errors,/duplicate DOI/);assert.match(errors,/invalid asset/);assert.match(errors,/without credentials/);
});
test('dates reject impossible calendar days and inverted memberships', () => {
  assert.equal(validDate('2024-02-29'),true);assert.equal(validDate('2023-02-29'),false);assert.equal(validDate('2024-02-31'),false);
  const data=fixture();data.people[0].memberships=[{start:'2024-06-01',end:'2024-01-01'}];assert.match(validateContent(data).join(),/ends before/);
});
test('explicit person links override name matching, including an empty list', () => {
  const person={id:'p1',name:'Ada Example'};const paper={authors:'Ada Example'};
  assert.equal(paperBelongsTo(paper,person),true);
  assert.equal(paperBelongsTo({...paper,personIds:[]},person),false);
  assert.equal(paperBelongsTo({authors:'Different Name',personIds:['p1']},person),true);
});
test('one award record drives publication badges and related views without duplicate text', () => {
  const awards=[{id:'a1',title:'Prize',personIds:['p1'],publicationIds:['work']}];
  assert.equal(decoratePapers([{id:'work',title:'Test',year:2024,award:'Prize'}],awards)[0].award,'Prize');
  assert.equal(awardsFor(awards,'personIds','p1').length,1);
});
test('explicit attribution combines with topic, venue and type filters', () => {
  const paper={id:'x',title:'Test',authors:'Different Name',year:2024,personIds:['p1'],topics:['Health'],venue:'CHI',type:'conference'};
  assert.equal(filterPapers([paper],{person:{id:'p1',name:'Ada Example'},topic:'Health',venue:'CHI',type:'conference'}).length,1);
  assert.equal(filterPapers([paper],{person:{id:'p2',name:'Different Name'}}).length,0);
});
test('closed and expired opportunities are hidden while closing-day listings stay visible', () => {
  const rows=[{id:'a',status:'open',closesOn:'2025-01-01'},{id:'b',status:'closed'},{id:'c',status:'open',closesOn:'2025-01-02'}];
  assert.deepEqual(openOpportunities(rows,'2025-01-02').map(o=>o.id),['c']);
});

test('award and project news reaches related profiles without duplicate events', () => {
  const news=[{id:'n',awardIds:['a'],projectIds:['p']}];
  assert.equal(relatedNews(news,'personIds','person',{awards:[{id:'a',personIds:['person']}],projects:[{id:'p',personIds:['person']}]}).length,1);
  assert.equal(relatedNews(news,'personIds','other').length,0);
});

test('new article and preprint types produce correct citation entries without legacy fields', () => {
  assert.match(bibtex({id:'a',type:'article',title:'Test',authors:'Ada',year:2024,venue:'Journal'}), /^@article/);
  assert.match(bibtex({id:'p',type:'preprint',title:'Test',authors:'Ada',year:2024,arxivId:'2401.12345'}), /archivePrefix = \{arXiv\}/);
});
