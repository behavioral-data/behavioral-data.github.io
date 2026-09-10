import PersonPhoto from '@/components/person-photo';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { papers, people, sponsors, pageContent, awards, news } from '@/lib/content';
import { latestAwardPapers, latestPeopleAwards } from '@/lib/relationships.mjs';
import PaperCard from '@/components/paper-card';
import EventDate from '@/components/event-date';
import NewsList from '@/components/news-list';
export const metadata = { alternates: { canonical: '/' } };
export default function Home() {
  const selected = latestAwardPapers(papers, awards);
  const peopleAwards = latestPeopleAwards(awards);
  return (
    <div className="home-page">
      <header className="hero" id="home">
        <h1>Welcome to the Behavioral Data Science Lab</h1>
        <div className="prose">
          <ReactMarkdown>{pageContent.home}</ReactMarkdown>
        </div>
      </header>
      <section className="people-callout" id="team">
        <div className="section-heading">
          <h2>Our Group</h2>
          <Link className="text-link" href="/team/">
            Team
          </Link>
        </div>
        <div className="people-preview">
          {people
            .filter((p) => p.status === 'member')
            .map((p) => (
              <article key={p.id}>
                <Link href={`/people/${p.id}/`}>
                  {p.image ? (
                    <PersonPhoto person={p} loading="lazy" />
                  ) : (
                    <div className="person-placeholder" />
                  )}
                  <h3>{p.name}</h3>
                </Link>
                <p>{p.role}</p>
              </article>
            ))}
        </div>
      </section>
      <section className="section group-highlights" id="highlights">
        <div className="section-heading">
          <h2>Group highlights</h2>
        </div>
        {peopleAwards.length > 0 && (
          <section className="highlight-group" aria-labelledby="people-awards-heading">
            <div className="section-heading">
              <h3 id="people-awards-heading">People awards</h3>
              <Link href="/awards/">All awards</Link>
            </div>
            <div className="people-award-highlights">
              {peopleAwards.map((award) => (
                <article key={award.id}>
                  <EventDate date={award.date} label={award.dateLabel} />
                  <h4>
                    <Link href={`/awards/#${award.id}`}>{award.title}</Link>
                  </h4>
                  <p>{award.organization}</p>
                  <p className="highlight-recipients">
                    {(award.personIds || []).map((id, index) => (
                      <span key={id}>
                        {index > 0 && ', '}
                        <Link href={`/people/${id}/`}>
                          {people.find((person) => person.id === id)?.name}
                        </Link>
                      </span>
                    ))}
                    {award.recipientNames?.join(', ')}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
        {news.length > 0 && (
          <section className="highlight-group" aria-labelledby="latest-news-heading">
            <div className="section-heading">
              <h3 id="latest-news-heading">Latest news</h3>
              <Link href="/news/">All news</Link>
            </div>
            <NewsList news={news.slice(0, 2)} compact />
          </section>
        )}
        {selected.length > 0 && (
          <section className="highlight-group" aria-labelledby="paper-awards-heading">
            <div className="section-heading">
              <h3 id="paper-awards-heading">Paper awards</h3>
              <Link href="/publications/">All publications</Link>
            </div>
            <div className="featured-grid">
              {selected.map((p) => (
                <PaperCard key={p.id} paper={p} featured headingLevel={4} />
              ))}
            </div>
          </section>
        )}
      </section>
      <section className="section" id="publications">
        <div className="section-heading">
          <h2>Publications</h2>
          <span className="count">{papers.length} papers</span>
        </div>
        <div className="paper-list">
          {papers.slice(0, 3).map((p) => (
            <PaperCard key={p.id} paper={p} />
          ))}
        </div>
        <Link className="text-link" href="/publications/">
          Full List
        </Link>
      </section>
      <section className="support">
        <h2>Support From</h2>
        <div>
          {sponsors.map((s) => (
            <span key={s.name}>
              <img src={`/resources${s.path}`} alt={s.name} title={s.name} loading="lazy" />
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
