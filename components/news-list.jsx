import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { formatDate, people, papers, awards, projects } from '@/lib/content';
export default function NewsList({ news }) {
  return news.map(n => <article className="news-item" key={n.id}>
    <time dateTime={n.date}>{formatDate(n.date)}</time><div className="prose"><ReactMarkdown>{n.headline}</ReactMarkdown>
      {(n.personIds?.length > 0 || n.publicationIds?.length > 0 || n.awardIds?.length > 0 || n.projectIds?.length > 0) && <ul>
        {(n.personIds || []).map(id => <li key={id}><Link href={`/people/${id}/`}>{people.find(p => p.id === id)?.name}</Link></li>)}
        {(n.publicationIds || []).map(id => <li key={id}><Link href={`/publications/${id}/`}>{papers.find(p => p.id === id)?.title}</Link></li>)}
        {(n.awardIds || []).map(id => <li key={id}><Link href={`/awards/#${id}`}>{awards.find(a => a.id === id)?.title}</Link></li>)}
        {(n.projectIds || []).map(id => <li key={id}><Link href={`/research/#${id}`}>{projects.find(p => p.id === id)?.title}</Link></li>)}
      </ul>}
    </div>
  </article>);
}
