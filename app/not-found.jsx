import Link from 'next/link';
import PageHeading from '@/components/page-heading';
export default function NotFound() { return <><PageHeading title="Page Not Found">Sorry, but the page you were trying to view does not exist.</PageHeading><Link className="text-link" href="/">Home</Link></>; }
