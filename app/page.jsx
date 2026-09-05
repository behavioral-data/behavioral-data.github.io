import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { papers, people, sponsors, pageContent } from '@/lib/content';
import PaperCard from '@/components/paper-card';
export default function Home() {
  const selected = papers.filter(p => p.highlight).slice(0, 2);
  return <>
    <header className="hero" id="home">
      <h1>Welcome to the Behavioral Data Science Lab</h1>
      <div className="prose"><ReactMarkdown>{pageContent.home}</ReactMarkdown></div>
    </header>
    <section className="people-callout" id="team"><div><h2>Our Group</h2><Link className="text-link" href="/team/">Team</Link></div><div className="people-preview">{people.filter(p => p.status === 'member' && p.image).slice(0, 4).map(p => <Link href={`/people/${p.id}/`} key={p.id}><img src={p.image} alt={p.name} loading="lazy" /><span>{p.name}</span></Link>)}</div></section>
    <section className="section" id="publications"><div className="section-heading"><h2>Group highlights</h2><Link href="/publications/">Publications</Link></div><div className="featured-grid">{selected.map(p => <PaperCard key={p.id} paper={p} featured />)}</div></section>
    <section className="section"><div className="section-heading"><h2>Publications</h2><span className="count">{papers.length} papers</span></div><div className="paper-list">{papers.slice(0, 3).map(p => <PaperCard key={p.id} paper={p} />)}</div><Link className="text-link" href="/publications/">Full List</Link></section>
    <section className="support"><h2>Support From</h2><div>{sponsors.map(s => <span key={s.name}><img src={`/resources${s.path}`} alt={s.name} title={s.name} loading="lazy" /></span>)}</div></section>
  </>;
}
