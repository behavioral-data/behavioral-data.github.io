import Link from 'next/link';
import { notFound } from 'next/navigation';
import { people, papers, safeUrl } from '@/lib/content';
import { matchesPerson } from '@/lib/publications.mjs';
import PaperCard from '@/components/paper-card';
import PageHeading from '@/components/page-heading';
export const dynamicParams = false;
export function generateStaticParams() { return people.map(p => ({ id: p.id })); }
export async function generateMetadata({ params }) { const { id } = await params; return { title: people.find(p => p.id === id)?.name || 'Person', alternates: { canonical: `/people/${id}/` } }; }
export default async function Person({ params }) {
  const { id } = await params; const p = people.find(p => p.id === id); if (!p) notFound();
  const related = papers.filter(paper => matchesPerson(paper, p.name));
  return <><PageHeading title={p.name} /><div className="profile">{p.image && <img src={p.image} alt={p.name} />}<div><h2>{p.role}</h2>{safeUrl(p.website) && <a className="text-link" href={safeUrl(p.website)}>Personal website</a>}{p.topics.length > 0 && <><h3 className="topics-heading">Research interests</h3><div className="tags">{p.topics.map(t => <span className="tag" key={t}>{t}</span>)}</div></>}</div></div>{related.length > 0 && <section className="section"><h2>Publications</h2><div className="paper-list">{related.map(paper => <PaperCard key={paper.id} paper={paper} />)}</div></section>}<Link className="back-link" href="/team/">Team</Link></>;
}
