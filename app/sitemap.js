import { papers, people } from '@/lib/content';
export const dynamic = 'force-static';
export default function sitemap() { return ['/', '/team/', '/publications/', '/news/', '/join/', '/research/', '/idiofid/', ...papers.map(p=>`/publications/${p.id}/`), ...people.map(p=>`/people/${p.id}/`)].map(path => ({ url: `https://behavioral-data.github.io${path}` })); }
