"""Check statically exported routes, links, assets, signup action, and draft exclusion."""
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


def check(root=ROOT):
    exported = (root / 'out').resolve()
    errors = set()
    anchors = {}
    fragment_links = []
    class Links(HTMLParser):
        def handle_starttag(self, tag, attrs):
            if tag == 'main' and dict(attrs).get('id') == 'main' and dict(attrs).get('tabindex') != '-1':
                errors.add(f'{self.file.relative_to(exported)}: skip-link target must accept keyboard focus')
            if tag in ('h1','h2','h3','h4','h5','h6'):
                level = int(tag[1])
                if self.heading_level and level > self.heading_level + 1:
                    errors.add(f'{self.file.relative_to(exported)}: heading jumps from h{self.heading_level} to h{level}')
                self.heading_level = level
            for key, value in attrs:
                if key == 'id' and value:
                    anchors.setdefault(self.file.resolve(), set()).add(value)
                if key not in ('href','src') or not value:
                    continue
                url = urlsplit(value)
                if url.scheme or url.netloc:
                    continue
                path = self.file if not url.path else ((exported / unquote(url.path).lstrip('/')) if url.path.startswith('/') else (self.file.parent / unquote(url.path)))
                target = path if path.is_file() else path / 'index.html'
                if key == 'href' and url.fragment:
                    fragment_links.append((self.file, target.resolve(), unquote(url.fragment)))
                if not path.is_file() and not (path / 'index.html').is_file():
                    errors.add(f'{self.file.relative_to(exported)}: missing {value}')
    html_files = list(exported.rglob('*.html'))
    if not html_files:
        errors.add('No exported HTML. Run npm run build first.')
    for file in html_files:
        parser = Links(); parser.file = file; parser.heading_level = None; parser.feed(file.read_text())
    for source, target, fragment in fragment_links:
        if fragment not in anchors.get(target, set()):
            errors.add(f'{source.relative_to(exported)}: missing anchor {fragment}')
    for fragment in ['home','team','publications']:
        if fragment not in anchors.get(exported / 'index.html', set()):
            errors.add('Missing legacy homepage anchor: ' + fragment)
    required = ['index.html','404.html','team/index.html','publications/index.html','allnews/index.html','vacancies/index.html','idiofid/index.html','awards/index.html','aboutwebsite.html','allnews.html','sitemap.xml','robots.txt','images/favicon.ico','.nojekyll']
    for collection, route in [('people','people'),('publications','publications')]:
        required += [f"{route}/{row['id']}/index.html" for row in json.loads((root / f'content/{collection}.json').read_text())]
    for name in required:
        if not (exported / name).is_file():
            errors.add('Missing required export: ' + name)
    pages = json.loads((root / 'content/pages.json').read_text())
    for route, field, collection, destination in [
            ('research', 'research', 'projects', '/publications/'),
            ('pictures', 'pictures', 'gallery', '/team/'),
            ('aboutwebsite', 'about', None, '/')]:
        records = json.loads((root / f'content/{collection}.json').read_text()) if collection else []
        page = exported / route / 'index.html'
        if not pages[field].strip() and not records:
            if not page.exists() or f'content="0;url={destination}"' not in page.read_text():
                errors.add(f'Empty legacy page must lead to useful content: /{route}/')
    signup = exported / 'idiofid/index.html'
    if signup.exists():
        settings = json.loads((root / 'content/site.json').read_text())
        if f'action="{settings["signupUrl"]}"' not in signup.read_text():
            errors.add('Signup form action was not preserved')
    for private in ['maintenance','_review','.cache','content','docs']:
        if (exported / private).exists():
            errors.add(f'Nonpublic directory leaked to export: {private}')
    return sorted(errors), len(html_files)


if __name__ == '__main__':
    errors, count = check()
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'Checked {count} exported pages, legacy routes, local links/assets, and signup action. No draft directories exported.')
