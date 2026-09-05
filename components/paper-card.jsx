import Link from 'next/link';
export default function PaperCard({ paper, featured = false }) {
  return <article className={featured ? 'paper-card featured-paper' : 'paper-card'}>
    {featured && <Link href={`/publications/${paper.id}/`} tabIndex={-1} aria-hidden="true" className="paper-art">{paper.image ? <img src={paper.image} alt="" loading="lazy" /> : <span>{paper.year}</span>}</Link>}
    <div className="paper-copy"><div className="eyebrow">{paper.year} <span>·</span> {paper.venue || 'Publication'}</div>
      <h3><Link href={`/publications/${paper.id}/`}>{paper.title}</Link></h3>
      <p className="authors">{paper.authorNames?.join(', ') || paper.authors}</p>
      {paper.status && paper.status !== 'published' && <p className="tag">{paper.status}</p>}
      {paper.award && <p className="award">{paper.award}</p>}
      {featured && paper.description && <p className="description">{paper.description}</p>}
      <div className="paper-links"><Link href={`/publications/${paper.id}/`}>Read more</Link>{paper.pdf && <a href={paper.pdf}>PDF</a>}</div>
    </div>
  </article>;
}
