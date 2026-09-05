'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links = [['/', 'Home'], ['/team/', 'Team'], ['/publications/', 'Publications'], ['/news/', 'News'], ['/join/', 'Open positions']];
export default function Navigation() {
  const pathname = usePathname();
  return <nav aria-label="Main navigation">{links.map(([href, title]) => <Link key={href} href={href} aria-current={pathname === href || pathname === href.slice(0, -1) ? 'page' : undefined}>{title}</Link>)}</nav>;
}
