'use client';
import { useMemo, useState } from 'react';
import { filterPapers } from '@/lib/publications.mjs';
import PaperCard from './paper-card';
export default function PublicationExplorer({ papers, people }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');
  const [topic, setTopic] = useState('');
  const [venue, setVenue] = useState('');
  const [type, setType] = useState('');
  const [awardsOnly, setAwardsOnly] = useState(false);
  const years = [...new Set(papers.map(p => p.year))].sort((a,b) => b-a);
  const topics = [...new Set(papers.flatMap(p => p.topics || []))].sort();
  const venues = [...new Set(papers.map(p => p.venue).filter(Boolean))].sort();
  const types = [...new Set(papers.map(p => p.type).filter(Boolean))].sort();
  const results = useMemo(() => filterPapers(papers, { query, year, person: people.find(p => p.id === author), topic, venue, type, awardsOnly }), [papers, people, query, year, author, topic, venue, type, awardsOnly]);
  const reset = () => { setQuery(''); setYear(''); setAuthor(''); setAwardsOnly(false); setTopic(''); setVenue(''); setType(''); };
  return <><div className="filters"><label className="field search">Search publications<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Title, author, venue, or keyword" /></label><label className="field">Year<select value={year} onChange={e => setYear(e.target.value)}><option value="">All years</option>{years.map(y => <option key={y}>{y}</option>)}</select></label><label className="field">Lab author<select value={author} onChange={e => setAuthor(e.target.value)}><option value="">All authors</option>{people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>{[['Topic',topic,setTopic,topics],['Venue',venue,setVenue,venues],['Type',type,setType,types]].map(([label,value,setValue,options]) => options.length > 0 && <label className="field" key={label}>{label}<select value={value} onChange={e => setValue(e.target.value)}><option value="">All</option>{options.map(v => <option key={v}>{v}</option>)}</select></label>)}<button className="filter-reset" onClick={reset}>Reset</button></div>
    <div className="results-bar"><p className="results-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'publication' : 'publications'}</p><label className="award-filter"><input type="checkbox" checked={awardsOnly} onChange={e => setAwardsOnly(e.target.checked)} /> Award-winning papers</label></div>
    {results.length ? <div className="paper-list">{results.map(p => <PaperCard key={p.id} paper={p} />)}</div> : <div className="empty"><h2>No matching publications</h2><button className="button" onClick={reset}>Clear filters</button></div>}
  </>;
}
