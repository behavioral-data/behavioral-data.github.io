import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { safeUrl, people, papers } from '@/lib/content';
export default function ProjectList({ projects }) {
  if (!projects.length) return null;
  return <section className="section"><h2>Projects</h2>{projects.map(p => <article key={p.id} id={p.id} className="section">
    <h3>{p.title}</h3>{p.image && <img className="detail-image" src={p.image} alt={p.title} />}
    {p.description && <div className="prose"><ReactMarkdown>{p.description}</ReactMarkdown></div>}
    <ul>{(p.personIds || []).map(id => <li key={id}><Link href={`/people/${id}/`}>{people.find(v => v.id === id)?.name}</Link></li>)}
      {(p.publicationIds || []).map(id => <li key={id}><Link href={`/publications/${id}/`}>{papers.find(v => v.id === id)?.title}</Link></li>)}</ul>
    <div className="paper-links">{[['url','Website'],['code','Code'],['dataset','Dataset']].map(([key,label]) => safeUrl(p[key]) && <a href={safeUrl(p[key])} key={key}>{label}</a>)}</div>
  </article>)}</section>;
}
