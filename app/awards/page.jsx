import PageHeading from '@/components/page-heading';
import NewsNavigation from '@/components/news-navigation';
import AwardList from '@/components/award-list';
import { awards } from '@/lib/content';
export const metadata = { title: 'Awards', alternates: { canonical: '/awards/' } };
export default function Page() {
  return (
    <>
      <PageHeading title="Awards" />
      <NewsNavigation current="awards" />
      <AwardList awards={awards} groupByYear />
    </>
  );
}
