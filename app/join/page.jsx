import { formatDate, opportunities, people, safeUrl } from '@/lib/content';
import { openOpportunities } from '@/lib/relationships.mjs';
import ReactMarkdown from 'react-markdown';
import PageHeading from '@/components/page-heading';
export const metadata = {
  title: 'Join us',
  description: 'Current postdoctoral and PhD opportunities with the Behavioral Data Science Group at the University of Washington.',
  alternates: { canonical: '/join/' },
};

export default function Join() {
  const open = openOpportunities(opportunities);
  return <>
    <PageHeading title="Join us">Explore current opportunities to work with the Behavioral Data Science Group at the University of Washington.</PageHeading>
    {open.length > 0 ? <div className="opportunity-grid">{open.map(opportunity => {
      const owner = people.find(person => person.id === opportunity.ownerId);
      return <article className="opportunity-card" key={opportunity.id}>
        <div className="opportunity-card-header">
          <span className="opportunity-status">Open</span>
          {opportunity.reviewedOn && <span className="opportunity-reviewed">Last verified {formatDate(opportunity.reviewedOn)}</span>}
        </div>
        <h2>{opportunity.title}</h2>
        {owner && <p className="opportunity-owner">Faculty lead: {owner.name}</p>}
        {opportunity.description && <div className="opportunity-description"><ReactMarkdown>{opportunity.description}</ReactMarkdown></div>}
        {opportunity.meta?.length > 0 && <ul className="opportunity-meta">{opportunity.meta.map(item => <li key={item}>{item}</li>)}</ul>}
        <div className="opportunity-actions">
          <a className="button" href={safeUrl(opportunity.url)}>{opportunity.actionLabel}<span aria-hidden="true">↗</span></a>
          {opportunity.sourceUrl && <a className="text-link" href={safeUrl(opportunity.sourceUrl)}>{opportunity.sourceLabel}</a>}
        </div>
      </article>;
    })}</div> : <section className="empty opportunities-empty">
      <h2>No currently advertised openings</h2>
      <p>New opportunities will be posted here. You can also explore graduate programs at the Allen School.</p>
      <a className="text-link" href="https://www.cs.washington.edu/academics/graduate/">Allen School graduate programs</a>
    </section>}
  </>;
}
