import { opportunities, safeUrl, pageContent } from '@/lib/content';
import { openOpportunities } from '@/lib/relationships.mjs';
import ReactMarkdown from 'react-markdown';
import PageHeading from '@/components/page-heading';
export const metadata = { title: 'Open positions', alternates: { canonical: '/join/' } };
export default function Join() {
  return <><PageHeading title="Open positions" /><div className="prose">{opportunities.length > 0 ? openOpportunities(opportunities).map(o => <section className="section" key={o.id}><h2>{o.title}</h2>{o.description && <ReactMarkdown>{o.description}</ReactMarkdown>}<a href={safeUrl(o.url)}>Apply</a></section>) : <ReactMarkdown>{pageContent.recruitment}</ReactMarkdown>}</div></>;
}
