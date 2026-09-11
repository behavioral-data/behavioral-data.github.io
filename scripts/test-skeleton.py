"""Build synthetic future-section records in a temporary checkout; never edit real content."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def write(root, name, rows):
    (root / f'content/{name}.json').write_text(json.dumps(rows, indent=2) + '\n')


def build(root):
    result = subprocess.run([str(ROOT/'node_modules/.bin/next'),'build','--webpack'],cwd=root,capture_output=True,text=True,env={**os.environ,'NEXT_TELEMETRY_DISABLED':'1'})
    if result.returncode:
        raise SystemExit(result.stdout + result.stderr)


def main():
    with tempfile.TemporaryDirectory(prefix='bdata-skeleton-') as directory:
        root = Path(directory)
        for name in ['app','components','lib','scripts','content','maintenance']:
            shutil.copytree(ROOT / name,root / name,ignore=shutil.ignore_patterns('__pycache__'))
        for name in ['next.config.mjs','jsconfig.json','package.json']:
            shutil.copy(ROOT / name,root / name)
        (root / 'node_modules').symlink_to(ROOT / 'node_modules',target_is_directory=True)
        (root / 'public').symlink_to(ROOT / 'public',target_is_directory=True)
        people = json.loads((root/'content/people.json').read_text())
        papers = json.loads((root/'content/publications.json').read_text())
        person = people[0]['id']; paper = papers[0]['id']
        papers[0].update(personIds=[person],topics=['Fixture topic'],type='article')
        write(root,'publications',papers)
        write(root,'awards',[{'id':'fixture-award','title':'Fixture award','organization':'Fixture organization','date':'2026-01-01','sourceUrl':'https://example.org/award','personIds':[person],'publicationIds':[paper]}])
        write(root,'projects',[{'id':'fixture-project','title':'Fixture project','personIds':[person],'publicationIds':[paper],'description':'Fixture project description','url':'https://example.org/project'}])
        write(root,'news',[{'id':'fixture-news','headline':'Fixture news','date':'2026-01-02','personIds':[person],'publicationIds':[paper],'awardIds':['fixture-award']}])
        common_opportunity = {'ownerId':person,'status':'open','description':'Fixture description','meta':['Fixture detail'],'actionLabel':'View details','reviewedOn':'2026-01-01','reviewOn':'2099-01-01'}
        write(root,'opportunities',[{'id':'fixture-open','title':'Fixture opening','url':'https://example.org/apply',**common_opportunity}, {'id':'fixture-closed','title':'Hidden closed opening','url':'https://example.org/closed',**common_opportunity,'status':'closed'}])
        write(root,'gallery',[{'id':'fixture-photo','image':people[0]['image'],'alt':'Fixture photo','caption':'Fixture caption'}])
        # Webpack supports a shared dependency symlink outside this temporary project root.
        build(root)
        subprocess.run(['node', 'scripts/export-aliases.mjs'], cwd=root, check=True)
        checks = {
            'news/index.html':['Fixture news','Fixture award'],
            'awards/index.html':['Fixture award'],
            f'people/{person}/index.html':['Fixture award','Fixture project','Fixture news'],
            f'publications/{paper}/index.html':['Fixture award','Fixture project','Fixture news'],
            'research/index.html':['Fixture project'],
            'pictures/index.html':['Fixture photo','Fixture caption'],
            'join/index.html':['Fixture opening'],
            'publications/index.html':['Fixture topic'],
        }
        for name, values in checks.items():
            html=(root/'out'/name).read_text()
            for value in values:
                if value not in html: raise SystemExit(f'{name}: missing {value}')
        if 'Hidden closed opening' in (root/'out/join/index.html').read_text():
            raise SystemExit('Closed opportunity rendered')
        sitemap = (root/'out/sitemap.xml').read_text()
        for route in ['research', 'pictures']:
            if f'/{route}/' not in sitemap:
                raise SystemExit(f'Populated {route} page missing from sitemap')
            if 'http-equiv="refresh"' in (root/f'out/{route}/index.html').read_text():
                raise SystemExit(f'Populated {route} page was replaced with a redirect')
        if (root/'out/maintenance').exists():
            raise SystemExit('Review queue leaked to export')
        write(root,'opportunities',[{'id':'fixture-closed','title':'Hidden closed opening','url':'https://example.org/closed',**common_opportunity,'status':'closed'}])
        build(root)
        join = (root/'out/join/index.html').read_text()
        if 'No currently advertised openings' not in join or 'Hidden closed opening' in join or 'We are also looking for PhD students' in join:
            raise SystemExit('All-closed opportunities did not render the neutral empty state')
        print(f'Fixture build passed: {len(checks)} routes render related records; closed opportunities use a neutral empty state and review files stay hidden. Real content unchanged.')


if __name__ == '__main__': main()
