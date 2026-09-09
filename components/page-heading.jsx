export default function PageHeading({ eyebrow, title, children }) {
  return <header className="page-heading">{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{children && <p>{children}</p>}</header>;
}
