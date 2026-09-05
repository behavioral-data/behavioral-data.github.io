import ReactMarkdown from 'react-markdown';
import { site, pageContent } from '@/lib/content';
import PageHeading from '@/components/page-heading';
export const metadata = { title: 'IdioFid-A', alternates: { canonical: '/idiofid/' } };
export default function Idiofid() { return <><PageHeading title="Idiographic Fidelity Benchmark – Attitude (IdioFid-A)" /><div className="prose"><ReactMarkdown>{pageContent.idiofid}</ReactMarkdown></div><form className="signup" action={site.signupUrl} method="POST"><label htmlFor="email">Email address</label><input id="email" type="email" name="email" autoComplete="email" required placeholder="Your email here" /><button className="button" type="submit">Notify me</button><p>We’ll only email about this benchmark.</p></form></>; }
