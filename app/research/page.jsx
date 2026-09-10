import ReactMarkdown from 'react-markdown';
import { pageContent, projects } from '@/lib/content';
import PageHeading from '@/components/page-heading';
import ProjectList from '@/components/project-list';
export const metadata = { title: 'Research' };
export default function Page() {
  return (
    <>
      <PageHeading title="Research" />
      <div className="prose">
        <ReactMarkdown>{pageContent.research}</ReactMarkdown>
      </div>
      <ProjectList projects={projects} />
    </>
  );
}
