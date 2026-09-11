import PersonPhoto from '@/components/person-photo';
import HeroNetwork from '@/components/hero-network';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { papers, people, sponsors, pageContent, awards, news } from '@/lib/content';
import {
  latestAwardPapers,
  latestPeopleAwards,
  groupAwardsByRecipient,
} from '@/lib/relationships.mjs';
import PaperCard from '@/components/paper-card';
import EventDate from '@/components/event-date';
import NewsList from '@/components/news-list';
export const metadata = { alternates: { canonical: '/' } };
export default function Home() {
  const selected = latestAwardPapers(papers, awards);
  const peopleAwards = groupAwardsByRecipient(latestPeopleAwards(awards), people);
  return (
    <div className="home-page">
      <header className="hero" id="home">
        <div className="hero-copy">
          <h1>Behavioral Data Science Lab</h1>
          <div className="prose">
            <ReactMarkdown>{pageContent.home}</ReactMarkdown>
          </div>
        </div>
        <HeroNetwork />
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
      {news.length > 0 && (
        <section
          className="section highlight-group"
          id="highlights"
          aria-labelledby="latest-news-heading"
        >
          <div className="section-heading">
            <h2 id="latest-news-heading">Latest news</h2>
            <Link href="/news/">See all news</Link>
          </div>
          <NewsList news={news.slice(0, 1)} compact />
        </section>
      )}
      {peopleAwards.length > 0 && (
        <section
          className="section highlight-group"
          id="people-awards"
          aria-labelledby="people-awards-heading"
        >
          <div className="section-heading">
            <h2 id="people-awards-heading">Latest people awards</h2>
            <Link href="/awards/">See all awards</Link>
          </div>
          <div className="people-award-highlights">
            {peopleAwards.map((recipient) => (
              <article key={recipient.id}>
                <h3>
                  {recipient.personId ? (
                    <Link href={`/people/${recipient.personId}/`}>{recipient.name}</Link>
                  ) : (
                    recipient.name
                  )}
                </h3>
                <ul className="recipient-awards">
                  {recipient.awards.map((award) => (
                    <li key={award.id}>
                      <p className="recipient-award-title">
                        <Link href={`/awards/#${award.id}`}>{award.title}</Link>
                      </p>
                      <p className="recipient-award-meta">
                        <EventDate date={award.date} label={award.dateLabel} /> ·{' '}
                        {award.organization}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
      {selected.length > 0 && (
        <section
          className="section highlight-group"
          id="paper-awards"
          aria-labelledby="paper-awards-heading"
        >
          <div className="section-heading">
            <h2 id="paper-awards-heading">Latest paper awards</h2>
            <Link href="/awards/">See all awards</Link>
          </div>
          <div className="featured-grid">
            {selected.map((p) => (
              <PaperCard key={p.id} paper={p} featured headingLevel={3} />
            ))}
          </div>
        </section>
      )}
      <section className="section" id="publications">
        <div className="section-heading">
          <h2>Latest publications</h2>
          <Link className="text-link" href="/publications/">
            See all {papers.length} papers
          </Link>
        </div>
        <div className="paper-list">
          {papers.slice(0, 3).map((p) => (
            <PaperCard key={p.id} paper={p} />
          ))}
        </div>
      </section>
      <section className="support">
        <h2>Past and present support</h2>
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
