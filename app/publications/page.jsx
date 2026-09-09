import { papers, people } from '@/lib/content';
import PageHeading from '@/components/page-heading';
import PublicationExplorer from '@/components/publication-explorer';
export const metadata = { title: 'Publications', alternates: { canonical: '/publications/' } };
export default function Publications() {
  return <><PageHeading title="Publications" /><PublicationExplorer papers={papers} people={people} /></>;
}
