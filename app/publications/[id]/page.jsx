import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { papers, safeUrl } from '@/lib/content';
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
  return <><header className="page-heading"><Link href="/publications/" className="back-link">Publications</Link><div className="eyebrow">{p.year} · {p.venue}</div><h1 className="paper-title">{p.title}</h1><p>{p.authorNames?.join(', ') || p.authors}</p>{p.award && <div className="award">{p.award}</div>}<div className="hero-links">{p.pdf && <a className="button" href={p.pdf}>PDF</a>}{safeUrl(doi) && <a href={safeUrl(doi)}>DOI</a>}{safeUrl(p.code) && <a href={safeUrl(p.code)}>Code</a>}{safeUrl(p.url) && <a href={safeUrl(p.url)}>Website</a>}</div></header>
    {p.image && <img className="detail-image" src={p.image} alt={`Research illustration for ${p.title}`} />}
    {p.description && <section className="prose section"><ReactMarkdown>{p.description}</ReactMarkdown></section>}
    <section className="section"><h2>BibTeX</h2><pre className="citation">{bibtex(p)}</pre></section></>;
}
