import Link from 'next/link';
import { papers, people, sponsors } from '@/lib/content';
import PaperCard from '@/components/paper-card';
export default function Home() {
  const selected = papers.filter(p => p.highlight).slice(0, 2);
  return <>
    <header className="hero">
      <h1>Welcome to the Behavioral Data Science Lab</h1>
      <div className="prose">
        <p>We are a research group at the <a href="http://cs.washington.edu">Paul G. Allen School of Computer Science of Engineering</a>. Our aim is to explore and understand behavior through the lens of data science.</p>
        <p>The Behavioral Data Science Group develops computational methods that leverage large-scale behavioral data to extract actionable insights about our lives, health and happiness through combining techniques from data science, social network analysis, and natural language processing. We currently work on research related to mental health, misinformation online, scientific reproducibility, and informing the COVID-19 response.</p>
      </div>
    </header>
    <section className="section"><div className="section-heading"><h2>Group highlights</h2><Link href="/publications/">Publications</Link></div><div className="featured-grid">{selected.map(p => <PaperCard key={p.id} paper={p} featured />)}</div></section>
    <section className="section"><div className="section-heading"><h2>Publications</h2><span className="count">{papers.length} papers</span></div><div className="paper-list">{papers.slice(0, 3).map(p => <PaperCard key={p.id} paper={p} />)}</div><Link className="text-link" href="/publications/">Full List</Link></section>
    <section className="people-callout"><div><h2>Our Group</h2><Link className="text-link" href="/team/">Team</Link></div><div className="people-preview">{people.filter(p => p.status === 'member' && p.image).slice(0, 4).map(p => <Link href={`/people/${p.id}/`} key={p.id}><img src={p.image} alt={p.name} loading="lazy" /><span>{p.name}</span></Link>)}</div></section>
    <section className="support"><h2>Support From</h2><div>{sponsors.map(s => <span key={s.name}><img src={`/resources${s.path}`} alt={s.name} title={s.name} loading="lazy" /></span>)}</div></section>
  </>;
}
