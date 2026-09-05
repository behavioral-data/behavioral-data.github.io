import ReactMarkdown from 'react-markdown';
import { pageContent } from '@/lib/content';
import PageHeading from '@/components/page-heading';
import ProjectList from '@/components/project-list';
import { projects } from '@/lib/content';
export const metadata = { title: 'Research' };
export default function Page() { return <><PageHeading title="Research" /><div className="prose"><ReactMarkdown>{pageContent.research}</ReactMarkdown></div><ProjectList projects={projects} /></>; }
