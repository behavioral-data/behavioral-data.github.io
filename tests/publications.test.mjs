import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPapers, matchesPerson, bibtex } from '../lib/publications.mjs';
const papers = [
  {id:'blade',title:'BLADE: Data-driven science',authors:'Gu, Ken and Althoff, Tim',year:2024,venue:'EMNLP',description:'Language model agents',award:''},
  {id:'empathy',title:'Supporting conversations',authors:'Sharma, Ashish and Lin, Inna W',year:2021,venue:'WWW',description:'Peer support',award:'Best Paper'}
];
test('keyword matching includes venue and description, ignores case and whitespace',()=>{
  assert.deepEqual(filterPapers(papers,{query:'  EMNLP   agents '}).map(p=>p.id),['blade']);
});
test('year, author and award filters combine rather than replace each other',()=>{
  assert.equal(filterPapers(papers,{year:'2024',author:'Ken Gu',awardsOnly:true}).length,0);
  assert.equal(filterPapers(papers,{year:'2021',author:'Inna Lin',awardsOnly:true}).length,1);
});
test('names match reversed bibliography ordering and middle initials',()=>{
  assert.ok(matchesPerson(papers[0],'Ken Gu'));assert.ok(matchesPerson(papers[1],'Inna Lin'));
  assert.equal(matchesPerson(papers[0],'Kenny Gu'),false);
});
test('empty filters restore the complete archive and unknown terms return no results',()=>{
  assert.equal(filterPapers(papers).length,2);assert.equal(filterPapers(papers,{query:'zzzz'}).length,0);
});
test('a first name and last name from different authors do not create a match',()=>{
  assert.equal(matchesPerson({authors:'Ken Smith and Alex Gu'},'Ken Gu'),false);
});
test('citation retains identifier and escapes braces from imported metadata',()=>{
  const value=bibtex({...papers[0],title:'{BLADE}',doi:'10.1234/test'});
  assert.match(value,/@inproceedings\{blade/);assert.match(value,/title = \{BLADE\}/);assert.match(value,/doi = \{10.1234\/test\}/);
});
