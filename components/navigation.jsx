'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links = [['/', 'Home'], ['/team/', 'Team'], ['/publications/', 'Publications'], ['/news/', 'News'], ['/join/', 'Open positions']];
export default function Navigation({ extraLinks = [] }) {
  const pathname = usePathname();
  return <nav aria-label="Main navigation">{[...links, ...extraLinks].map(([href, title]) => <Link key={href} href={href} aria-current={pathname === href || pathname === href.slice(0, -1) || (href !== '/' && pathname.startsWith(href)) || (href === '/team/' && pathname.startsWith('/people/')) ? 'page' : undefined}>{title}</Link>)}</nav>;
}
