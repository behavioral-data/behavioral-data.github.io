import pageData from '@/content/pages.json';
import awardsData from '@/content/awards.json';
import projectsData from '@/content/projects.json';
import opportunitiesData from '@/content/opportunities.json';
import galleryData from '@/content/gallery.json';
import siteData from '@/content/site.json';
import { decoratePapers } from './relationships.mjs';
import peopleData from '@/content/people.json';
import paperData from '@/content/publications.json';
import newsData from '@/content/news.json';
import alumniData from '@/content/alumni.json';
import sponsorData from '@/content/sponsors.json';

export const people = [...peopleData].sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
export const papers = decoratePapers(paperData, awardsData);
export const news = [...newsData].sort((a,b) => b.date.localeCompare(a.date));
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

export const awards = [...awardsData].sort((a,b) => b.date.localeCompare(a.date));
export const projects = projectsData;
export const opportunities = opportunitiesData;
export const gallery = galleryData;
export const site = siteData;

export const pageContent = pageData;
