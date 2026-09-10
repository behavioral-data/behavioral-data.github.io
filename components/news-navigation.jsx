import Link from 'next/link';
export default function NewsNavigation({ current }) {
  return (
    <nav className="archive-nav" aria-label="News and awards">
      <Link href="/news/" aria-current={current === 'news' ? 'page' : undefined}>
        News
      </Link>
      <Link href="/awards/" aria-current={current === 'awards' ? 'page' : undefined}>
        Awards
      </Link>
    </nav>
  );
}
