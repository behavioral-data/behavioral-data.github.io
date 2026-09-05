import Link from 'next/link';
import { people, alumni, safeUrl } from '@/lib/content';
import PageHeading from '@/components/page-heading';
export const metadata = { title: 'People', alternates: { canonical: '/team/' } };
function PersonGrid({ members }) { return <div className="people-grid">{members.map(p => <article className="person-card" key={p.id}><Link href={`/people/${p.id}/`}>{p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <div className="person-placeholder" />}<h3>{p.name}</h3></Link><p>{p.role}</p></article>)}</div>; }
export default function Team() {
  const members = people.filter(p => p.status === 'member'); const visitors = people.filter(p => p.status === 'visitor');
  const mergedAlumni = [...alumni];
  for (const p of people.filter(p => p.status === 'alumni')) {
    if (!mergedAlumni.some(a => a.name.toLowerCase().startsWith(p.name.toLowerCase()))) mergedAlumni.push({ name: `${p.name}, ${p.role}`, site: p.website });
  }
  return <><PageHeading title="Our Group" /><PersonGrid members={members} />{visitors.length > 0 && <section className="section"><h2>Current Visitors</h2><PersonGrid members={visitors} /></section>}<section className="section"><h2>Alumni</h2><ul className="alumni-list">{mergedAlumni.map(a => <li key={a.name}>{safeUrl(a.site) ? <a href={safeUrl(a.site)}>{a.name}</a> : a.name}</li>)}</ul></section></>;
}
