import Link from 'next/link';
import AwardList from '@/components/award-list';
import NewsList from '@/components/news-list';
import { papers, news, awards } from '@/lib/content';
import PageHeading from '@/components/page-heading';
export const metadata = { title: 'News', alternates: { canonical: '/news/' } };
export default function News() {
  const legacyAwards = papers.filter(p => p.award && !awards.some(a => a.publicationIds?.includes(p.id)));
  return <><PageHeading title="News" /><section><NewsList news={news} /></section><AwardList awards={awards} />
    {legacyAwards.length > 0 && <section className="section">{awards.length === 0 && <h2>Awards</h2>}{legacyAwards.map(p => <article className="news-item" key={p.id}>
      <span className="eyebrow">{p.year}</span><div><p className="award">{p.award}</p><h3><Link href={`/publications/${p.id}/`}>{p.title}</Link></h3><p className="authors">{p.authors}</p></div>
    </article>)}</section>}
  </>;
}
