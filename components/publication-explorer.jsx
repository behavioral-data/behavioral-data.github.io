'use client';
import { useMemo, useState } from 'react';
import { displayVenue, filterPapers } from '@/lib/publications.mjs';
import PaperCard from './paper-card';
export default function PublicationExplorer({ papers, people }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');
  const [topic, setTopic] = useState('');
  const [venue, setVenue] = useState('');
  const [type, setType] = useState('');
  const [awardsOnly, setAwardsOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);
  const topics = [...new Set(papers.flatMap((p) => p.topics || []))].sort();
  const venues = [...new Set(papers.filter((p) => p.venue).map(displayVenue))].sort();
  const types = [...new Set(papers.map((p) => p.type).filter(Boolean))].sort();
  const results = useMemo(
    () =>
      filterPapers(papers, {
        query,
        year,
        person: people.find((p) => p.id === author),
        topic,
        venue,
        type,
        awardsOnly,
      }),
    [papers, people, query, year, author, topic, venue, type, awardsOnly],
  );
  const activeFilters = [
    year && { key: 'year', label: `Year: ${year}`, clear: () => setYear('') },
    author && {
      key: 'author',
      label: `Author: ${people.find((p) => p.id === author)?.name}`,
      clear: () => setAuthor(''),
    },
    topic && { key: 'topic', label: `Topic: ${topic}`, clear: () => setTopic('') },
    venue && { key: 'venue', label: `Venue: ${venue}`, clear: () => setVenue('') },
    type && { key: 'type', label: `Type: ${type}`, clear: () => setType('') },
    awardsOnly && {
      key: 'awards',
      label: 'Award-winning papers',
      clear: () => setAwardsOnly(false),
    },
  ].filter(Boolean);
  const reset = () => {
    setQuery('');
    setYear('');
    setAuthor('');
    setAwardsOnly(false);
    setTopic('');
    setVenue('');
    setType('');
  };
  return (
    <>
      <div className="filters">
        <div className="filter-search-row">
          <label className="field search">
            Search publications
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title, author, venue, or keyword"
            />
          </label>
          <button
            className="filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="publication-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters{activeFilters.length > 0 && ` (${activeFilters.length})`}
            <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
          </button>
        </div>
        <div className="advanced-filters" id="publication-filters" data-open={filtersOpen}>
          <label className="field">
            Year
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Lab author
            <select value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value="">All authors</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          {[
            ['Topic', topic, setTopic, topics],
            ['Venue', venue, setVenue, venues],
            ['Type', type, setType, types],
          ].map(
            ([label, value, setValue, options]) =>
              options.length > 0 && (
                <label className="field" key={label}>
                  {label}
                  <select value={value} onChange={(e) => setValue(e.target.value)}>
                    <option value="">All</option>
                    {options.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
              ),
          )}
          <label className="award-filter">
            <input
              type="checkbox"
              checked={awardsOnly}
              onChange={(e) => setAwardsOnly(e.target.checked)}
            />
            Award-winning papers
          </label>
        </div>
      </div>
      {activeFilters.length > 0 && (
        <ul className="active-filters" aria-label="Active filters">
          {activeFilters.map((filter) => (
            <li key={filter.key}>
              <button onClick={filter.clear} aria-label={`Remove ${filter.label}`}>
                {filter.label}
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="results-bar">
        <p className="results-count" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? 'publication' : 'publications'}
        </p>
        {(query || activeFilters.length > 0) && (
          <button className="filter-reset" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>
      {results.length ? (
        <div className="paper-list">
          {results.map((p) => (
            <PaperCard key={p.id} paper={p} headingLevel={2} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No matching publications</h2>
          <button className="button" onClick={reset}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
