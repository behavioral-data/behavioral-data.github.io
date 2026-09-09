"""Render recent, potentially lab-relevant papers for human review. No approval occurs."""
from datetime import date
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def clean(value):
    return re.sub(r'[\r\n<>`\[\]]', ' ', str(value)).replace('\\n', ' ')


def render(root=ROOT):
    def read(path):
        return json.loads((root / path).read_text())
    queue = read('maintenance/review.json')
    people = {p['id']: p for p in read('content/people.json')}
    by_id = {c['id']: c for c in queue['candidates']}
    first_year = date.today().year - 1
    selected = [c for c in queue['candidates'] if c['status'] == 'pending'
                and not c.get('duplicateOf') and c['observed']['year'] >= first_year
                and c.get('labRelevance', {}).get('status') in ('meets-rule', 'needs-membership-review')]
    supplement_path = root / 'maintenance/scholar-supplement.json'
    supplements = read('maintenance/scholar-supplement.json')['candidates'] if supplement_path.exists() else []
    for c in supplements:
        if c['status'] == 'pending' and c['year'] >= first_year:
            selected.append({**c, 'observed': {**c, 'url': c['sourceUrl']}})
    selected.sort(key=lambda c: (-c['observed']['year'], c['observed']['title'].casefold()))
    profiles_path = root / 'maintenance/scholar-profiles.json'
    profiles = read('maintenance/scholar-profiles.json') if profiles_path.exists() else []
    scholar_checked = max((p.get('checkedOn', '') for p in profiles), default='not recorded')
    lines = ['# Recent publication review', '',
             f'{len(selected)} distinct papers from {first_year} onward. Choose **include**, **exclude**, or **unsure**. Reply in chat with the numbered decisions or candidate IDs. Nothing here has been approved for the website.', '',
             'Rule: at least two lab authors, including Tim plus a current or past member. Confirm membership at the time of the work and whether it belongs to the lab. Duplicate versions appear under one item; source records remain available.', '',
             f'Google Scholar profiles last checked: {scholar_checked}. See `_planning/SCHOLAR_LATEST_REVIEW.md` for coverage and remaining uncertainties.', '']
    for n, c in enumerate(selected, 1):
        observed = c['observed']
        p = {**observed, **c.get('changes', {})}
        corrected = sorted(field for field in c.get('changes', {})
                           if c['changes'][field] != observed.get(field))
        names = [people[i]['name'] for i in c['matchedPersonIds']]
        lines += [f"## {n}. {clean(p['title'])}", '',
                  f"**Year:** {p['year']} · **Venue:** {clean(p.get('venue') or 'Not specified')}", '',
                  '**Matched lab coauthors:** ' + ', '.join(names), '',
                  '**Full author list:** ' + '; '.join(clean(a) for a in p['authorNames']), '',
                  f"[Paper]({p['url']}) · [Source record]({c['sourceUrl']})", '']
        if corrected:
            lines += ['**Reviewer-corrected metadata:** ' + ', '.join(corrected) + '.', '']
        for alternate in c.get('alternateRecordIds', []):
            other = by_id[alternate]
            lines += [f"Other version: [{clean(other['observed']['title'])}]({other['observed']['url']}) ({other['observed']['year']}).", '']
        if c.get('identityReviewPersonIds'):
            lines += ['**Check author identity:** ' + ', '.join(people[i]['name'] for i in c['identityReviewPersonIds']) + '.', '']
        if c['id'] in ('openalex-w4417255562', 'openalex-w7196961304'):
            lines += ['**Year discrepancy:** Scholar displays 2026; the conference record is NeurIPS 2025. Keep the conference year unless review establishes otherwise.', '']
        if c.get('note'):
            lines += [c['note'], '']
        if c.get('possibleDuplicates'):
            lines += ['**Check against existing site records:** ' + ', '.join(c['possibleDuplicates']), '']
        lines += ['**Needs checking:** lab attribution and membership dates.', '', '**Decision:** Pending', '', f"Candidate ID: `{c['id']}`", '']
    return '\n'.join(lines)


if __name__ == '__main__':
    (ROOT / 'maintenance/recent-review.md').write_text(render())
