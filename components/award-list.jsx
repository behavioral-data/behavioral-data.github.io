import Link from 'next/link';
import { people, papers, safeUrl } from '@/lib/content';
import EventDate from '@/components/event-date';
export default function AwardList({ awards, heading = true }) {
  if (!awards.length) return null;
  const AwardHeading = heading ? 'h3' : 'h2';
  return (
    <section className="section">
      {heading && <h2>Awards</h2>}
      {awards.map((a) => (
        <article className="news-item" key={a.id} id={a.id}>
          <EventDate date={a.date} label={a.dateLabel} />
          <div>
            <AwardHeading className="award-title">{a.title}</AwardHeading>
            <p>{a.organization}</p>
            {a.recipientLabel && <p>{a.recipientLabel}</p>}
            <ul>
              {(a.recipientNames || []).map((name) => (
                <li key={name}>{name}</li>
              ))}
              {(a.personIds || []).map((id) => (
                <li key={id}>
                  <Link href={`/people/${id}/`}>{people.find((p) => p.id === id)?.name}</Link>
                </li>
              ))}
              {(a.publicationIds || []).map((id) => (
                <li key={id}>
                  <Link href={`/publications/${id}/`}>
                    {papers.find((p) => p.id === id)?.title}
                  </Link>
                </li>
              ))}
            </ul>
            {safeUrl(a.sourceUrl) && (
              <a className="text-link" href={safeUrl(a.sourceUrl)}>
                Source
              </a>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
