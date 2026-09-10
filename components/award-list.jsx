import Link from 'next/link';
import { people, papers, safeUrl } from '@/lib/content';
import EventDate from '@/components/event-date';
function AwardItem({ award, headingLevel }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className="news-item" id={award.id}>
      <EventDate date={award.date} label={award.dateLabel} />
      <div>
        <Heading className="award-title">{award.title}</Heading>
        <p>{award.organization}</p>
        {award.recipientLabel && <p>{award.recipientLabel}</p>}
        <ul>
          {(award.recipientNames || []).map((name) => (
            <li key={name}>{name}</li>
          ))}
          {(award.personIds || []).map((id) => (
            <li key={id}>
              <Link href={`/people/${id}/`}>{people.find((p) => p.id === id)?.name}</Link>
            </li>
          ))}
          {(award.publicationIds || []).map((id) => (
            <li key={id}>
              <Link href={`/publications/${id}/`}>{papers.find((p) => p.id === id)?.title}</Link>
            </li>
          ))}
        </ul>
        {safeUrl(award.sourceUrl) && (
          <a className="text-link" href={safeUrl(award.sourceUrl)}>
            Source
          </a>
        )}
      </div>
    </article>
  );
}
export default function AwardList({ awards, heading = true, groupByYear = false }) {
  if (!awards.length) return null;
  if (groupByYear) {
    const years = [...new Set(awards.map((a) => a.date.slice(0, 4)))].sort().reverse();
    return (
      <>
        <nav className="year-nav" aria-label="Award years">
          {years.map((year) => (
            <a key={year} href={`#awards-${year}`}>
              {year}
            </a>
          ))}
        </nav>
        {years.map((year) => (
          <section
            className="award-year"
            id={`awards-${year}`}
            key={year}
            aria-labelledby={`awards-heading-${year}`}
          >
            <h2 id={`awards-heading-${year}`}>{year}</h2>
            {awards
              .filter((a) => a.date.startsWith(year))
              .map((a) => (
                <AwardItem key={a.id} award={a} headingLevel={3} />
              ))}
          </section>
        ))}
      </>
    );
  }
  return (
    <section className="section">
      {heading && <h2>Awards</h2>}
      {awards.map((a) => (
        <AwardItem key={a.id} award={a} headingLevel={heading ? 3 : 2} />
      ))}
    </section>
  );
}
