import Link from 'next/link';
import { people, papers, safeUrl, formatDate } from '@/lib/content';
export default function AwardList({ awards, heading = true }) {
  if (!awards.length) return null;
  return <section className="section">{heading && <h2>Awards</h2>}{awards.map(a => <article className="news-item" key={a.id} id={a.id}>
    <time dateTime={a.date}>{formatDate(a.date)}</time><div><h3>{a.title}</h3><p>{a.organization}</p>
      <ul>{(a.personIds || []).map(id => <li key={id}><Link href={`/people/${id}/`}>{people.find(p => p.id === id)?.name}</Link></li>)}
        {(a.publicationIds || []).map(id => <li key={id}><Link href={`/publications/${id}/`}>{papers.find(p => p.id === id)?.title}</Link></li>)}</ul>
      {safeUrl(a.sourceUrl) && <a className="text-link" href={safeUrl(a.sourceUrl)}>Source</a>}
    </div></article>)}</section>;
}
