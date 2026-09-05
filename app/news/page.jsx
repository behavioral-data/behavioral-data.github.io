import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { papers, news, formatDate } from '@/lib/content';
import PageHeading from '@/components/page-heading';
export const metadata = { title: 'News', alternates: { canonical: '/news/' } };
export default function News() { return <><PageHeading title="News" /><section>{news.map(n => <article className="news-item" key={n.id}><time dateTime={n.date}>{formatDate(n.date)}</time><div className="prose"><ReactMarkdown>{n.headline}</ReactMarkdown></div></article>)}</section><section className="section"><h2>Awards</h2>{papers.filter(p => p.award).map(p => <article className="news-item" key={p.id}><span className="eyebrow">{p.year}</span><div><p className="award">{p.award}</p><h3><Link href={`/publications/${p.id}/`}>{p.title}</Link></h3><p className="authors">{p.authors}</p></div></article>)}</section></>; }
