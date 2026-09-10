import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { people, papers, awards, projects } from '@/lib/content';
import EventDate from '@/components/event-date';
export default function NewsList({ news, compact = false }) {
  return news.map((n) => {
    const relatedPeople = (n.personIds || []).filter(
      (id) => !n.headline.includes(`](/people/${id}/)`),
    );
    return (
      <article className="news-item" key={n.id}>
        <EventDate date={n.date} />
        <div className="prose">
          <ReactMarkdown>{n.headline}</ReactMarkdown>
          {!compact &&
            (relatedPeople.length > 0 ||
              n.publicationIds?.length > 0 ||
              n.awardIds?.length > 0 ||
              n.projectIds?.length > 0) && (
              <ul>
                {relatedPeople.map((id) => (
                  <li key={id}>
                    <Link href={`/people/${id}/`}>{people.find((p) => p.id === id)?.name}</Link>
                  </li>
                ))}
                {(n.publicationIds || []).map((id) => (
                  <li key={id}>
                    <Link href={`/publications/${id}/`}>
                      {papers.find((p) => p.id === id)?.title}
                    </Link>
                  </li>
                ))}
                {(n.awardIds || []).map((id) => (
                  <li key={id}>
                    <Link href={`/awards/#${id}`}>
                      {awards.find((a) => a.id === id)?.title}
                      {' · '}
                      {awards.find((a) => a.id === id)?.organization}
                    </Link>
                  </li>
                ))}
                {(n.projectIds || []).map((id) => (
                  <li key={id}>
                    <Link href={`/research/#${id}`}>
                      {projects.find((p) => p.id === id)?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </article>
    );
  });
}
