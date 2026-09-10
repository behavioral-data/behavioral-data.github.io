import { papers, people, site, projects, gallery, pageContent } from '@/lib/content';
export const dynamic = 'force-static';
export default function sitemap() {
  return [
    '/',
    '/team/',
    '/publications/',
    '/news/',
    '/awards/',
    '/join/',
    ...(projects.length || pageContent.research.trim() ? ['/research/'] : []),
    ...(gallery.length || pageContent.pictures.trim() ? ['/pictures/'] : []),
    ...(pageContent.about.trim() ? ['/aboutwebsite/'] : []),
    '/idiofid/',
    ...papers.map((p) => `/publications/${p.id}/`),
    ...people.map((p) => `/people/${p.id}/`),
  ].map((path) => ({ url: `${site.url}${path}` }));
}
