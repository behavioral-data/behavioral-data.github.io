import NewsList from '@/components/news-list';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { papers, safeUrl, awards, projects, news } from '@/lib/content';
import AwardList from '@/components/award-list';
import ProjectList from '@/components/project-list';
import { awardsFor, relatedNews } from '@/lib/relationships.mjs';
import { bibtex } from '@/lib/publications.mjs';
export const dynamicParams = false;
export function generateStaticParams() { return papers.map(p => ({ id: p.id })); }
export async function generateMetadata({ params }) {
  const { id } = await params; const p = papers.find(p => p.id === id);
  return { title: p?.title || 'Publication', alternates: { canonical: `/publications/${id}/` }, other: p ? { citation_title: p.title, citation_publication_date: String(p.year) } : {} };
}
export default async function Publication({ params }) {
  const { id } = await params; const p = papers.find(p => p.id === id); if (!p) notFound();
  const doi = p.doi ? (/^https?:\/\//.test(p.doi) ? p.doi : `https://doi.org/${p.doi}`) : '';
  const updates = relatedNews(news, 'publicationIds', p.id, { awards, projects });
  return <><header className="page-heading"><Link href="/publications/" className="back-link">Publications</Link><div className="eyebrow">{p.year} · {p.venue}</div><h1 className="paper-title">{p.title}</h1><p>{p.authorNames?.join(', ') || p.authors}</p>{p.status && p.status !== 'published' && <p className="tag">{p.status}</p>}{p.award && <div className="award">{p.award}</div>}<div className="hero-links">{p.pdf && <a className="button" href={p.pdf}>PDF</a>}{p.arxivId && <a href={`https://arxiv.org/abs/${p.arxivId}`}>arXiv</a>}{safeUrl(doi) && <a href={safeUrl(doi)}>DOI</a>}{safeUrl(p.dataset) && <a href={safeUrl(p.dataset)}>Dataset</a>}{safeUrl(p.code) && <a href={safeUrl(p.code)}>Code</a>}{safeUrl(p.url) && <a href={safeUrl(p.url)}>Website</a>}</div></header>
    {p.image && <img className="detail-image" src={p.image} alt={`Research illustration for ${p.title}`} />}
    {p.description && <section className="prose section"><ReactMarkdown>{p.description}</ReactMarkdown></section>}
    {updates.length > 0 && <section className="section"><h2>News</h2><NewsList news={updates} /></section>}<AwardList awards={awardsFor(awards, 'publicationIds', p.id)} /><ProjectList projects={projects.filter(project => project.publicationIds?.includes(p.id))} /><section className="section"><h2>BibTeX</h2><pre className="citation">{bibtex(p)}</pre></section></>;
}
