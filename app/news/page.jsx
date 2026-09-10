import NewsList from '@/components/news-list';
import NewsNavigation from '@/components/news-navigation';
import { news } from '@/lib/content';
import PageHeading from '@/components/page-heading';
export const metadata = { title: 'News', alternates: { canonical: '/news/' } };
export default function News() {
  return (
    <>
      <PageHeading title="News" />
      <NewsNavigation current="news" />
      <section aria-label="Lab news">
        <NewsList news={news} />
      </section>
    </>
  );
}
