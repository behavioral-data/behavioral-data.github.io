import { formatDate } from '@/lib/dates.mjs';

export default function EventDate({ date, label }) {
  return /^\d{4}$/.test(date) ? (
    <span className="event-date">{label || date}</span>
  ) : (
    <time className="event-date" dateTime={date}>
      {formatDate(date)}
    </time>
  );
}
