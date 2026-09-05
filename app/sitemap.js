import { papers, people, site } from '@/lib/content';
export const dynamic = 'force-static';
export default function sitemap() { return ['/', '/team/', '/publications/', '/news/', '/awards/', '/join/', '/research/', '/idiofid/', ...papers.map(p=>`/publications/${p.id}/`), ...people.map(p=>`/people/${p.id}/`)].map(path => ({ url: `${site.url}${path}` })); }
