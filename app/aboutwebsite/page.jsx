import ReactMarkdown from 'react-markdown';
import { pageContent } from '@/lib/content';
import PageHeading from '@/components/page-heading';
export const metadata = { title: 'About the website' };
export default function Page() { return <><PageHeading title="About the website" /><div className="prose"><ReactMarkdown>{pageContent.about}</ReactMarkdown></div></>; }
