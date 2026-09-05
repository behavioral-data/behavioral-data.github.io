import peopleData from '@/content/people.json';
import paperData from '@/content/publications.json';
import newsData from '@/content/news.json';
import alumniData from '@/content/alumni.json';
import sponsorData from '@/content/sponsors.json';

export const people = [...peopleData].sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
export const papers = paperData;
export const news = newsData;
export const alumni = alumniData;
export const sponsors = sponsorData;
export function safeUrl(value) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) return value;
  return undefined;
}
export function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}
