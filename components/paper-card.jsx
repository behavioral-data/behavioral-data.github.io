import Link from 'next/link';
export default function PaperCard({ paper, featured = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className={featured ? 'paper-card featured-paper' : 'paper-card'}>
      {featured && paper.image && (
        <Link
          href={`/publications/${paper.id}/`}
          tabIndex={-1}
          aria-hidden="true"
          className="paper-art"
        >
          <img src={paper.image} alt="" loading="lazy" />
        </Link>
      )}
      <div className="paper-copy">
        <div className="eyebrow">
          {paper.year} <span>·</span> {paper.venue || 'Publication'}
          {paper.status && !['published', 'accepted'].includes(paper.status) && ` ${paper.status}`}
        </div>
        <Heading>
          <Link href={`/publications/${paper.id}/`}>{paper.title}</Link>
        </Heading>
        <p className="authors">{paper.authorNames?.join(', ') || paper.authors}</p>
        {paper.award && <p className="award">{paper.award}</p>}
        {featured && paper.description && <p className="description">{paper.description}</p>}
        <div className="paper-links">
          <Link href={`/publications/${paper.id}/`}>Read more</Link>
          {paper.pdf && <a href={paper.pdf}>PDF</a>}
        </div>
      </div>
    </article>
  );
}
