import ReactMarkdown from 'react-markdown';
import { pageContent } from '@/lib/content';
import PageHeading from '@/components/page-heading';
import { gallery } from '@/lib/content';
export const metadata = { title: 'Pictures' };
export default function Page() { return <><PageHeading title="Pictures" /><div className="prose"><ReactMarkdown>{pageContent.pictures}</ReactMarkdown></div><div className="people-grid">{gallery.map(p => <figure key={p.id}><img src={p.image} alt={p.alt} loading="lazy" />{p.caption && <figcaption>{p.caption}</figcaption>}</figure>)}</div></>; }
