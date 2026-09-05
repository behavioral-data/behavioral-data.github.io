import Link from 'next/link';
import { site, projects, gallery } from '@/lib/content';
import Navigation from '@/components/navigation';
import './globals.css';
export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Behavioral Data Science · University of Washington', template: '%s · Behavioral Data Science' },
  description: site.description,
  icons: { icon: '/images/logopic/Logo_Bdata_text_below.png' },
};
export default function RootLayout({ children }) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>
    <aside className="sidebar"><Link href="/" className="lab-brand" aria-label="Behavioral Data Science home">
        <picture>
          <source media="(max-width: 760px)" srcSet="/images/logopic/Logo_Bdata.png" width="740" height="125" />
          <img src="/images/logopic/Logo_Bdata_text_below.png" width="1800" height="2425" alt="Behavioral Data Science" />
        </picture>
      </Link>
      <p className="brand-caption">Behavioral<br />Data Science</p><Navigation extraLinks={[...(projects.length ? [['/research/', 'Research']] : []), ...(gallery.length ? [['/pictures/', 'Pictures']] : [])]} />
      <div className="sidebar-bottom"><p>University of Washington<br />Paul G. Allen School</p><a href="https://www.cs.washington.edu/">Seattle, WA</a></div>
    </aside>
    <div className="site-body"><main id="main">{children}</main><footer><div>We are part of the <a href="https://www.cs.washington.edu/">Paul G. Allen School of Computer Science &amp; Engineering</a> at the <a href="https://www.washington.edu/">University of Washington</a>.</div></footer></div>
  </body></html>;
}
