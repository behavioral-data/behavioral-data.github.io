"""Look up a DOI and save a local proposal. This never publishes or edits live content.

Usage: python3 scripts/prepare_publication.py 10.xxxx/example
"""
import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]


def normalize_doi(value):
    value = re.sub(r"^https?://(?:dx\.)?doi\.org/", "", value.strip(), flags=re.I)
    value = re.sub(r"^doi:\s*", "", value, flags=re.I).lower()
    if not re.fullmatch(r"10\.\d{4,9}/\S+", value):
        raise ValueError("Enter a DOI such as 10.1234/example or its doi.org URL.")
    return value


def proposal(message, doi):
    names = [" ".join(filter(None, [a.get("given"), a.get("family")])) or a.get("name", "") for a in message.get("author", [])]
    names = [n for n in names if n]
    dates = message.get("published", message.get("issued", {})).get("date-parts", [[]])
    if not message.get("title") or not names or not dates[0]:
        raise ValueError("The source is missing title, authors, or year. Review it manually.")
    return {
        "id": "doi-" + hashlib.sha256(doi.encode()).hexdigest()[:12],
        "title": message["title"][0], "authors": " and ".join(names), "authorNames": names,
        "year": dates[0][0], "venue": next(iter(message.get("container-title", [])), ""),
        "description": "", "highlight": False, "award": "", "pdf": "", "image": "", "code": "",
        "doi": doi, "url": "https://doi.org/" + doi,
        "legacy": {"journal": next(iter(message.get("container-title", [])), "")} if message.get("type") == "journal-article" else {},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("doi")
    args = parser.parse_args()
    doi = normalize_doi(args.doi)
    existing = json.loads((ROOT / "content/publications.json").read_text())
    for paper in existing:
        if paper.get("doi") and normalize_doi(paper["doi"]) == doi:
            raise SystemExit(f"Already present: {paper['id']}. No proposal created.")
    request = Request("https://api.crossref.org/works/" + quote(doi, safe=""), headers={"User-Agent": "BDataWebsite/1.0 (publication metadata for human review)"})
    with urlopen(request, timeout=30) as response:
        message = json.load(response)["message"]
    candidate = proposal(message, doi)
    out = ROOT / "_review" / (candidate["id"] + ".json")
    out.parent.mkdir(exist_ok=True)
    if out.exists():
        raise SystemExit(f"Proposal already exists at {out}. Preserving reviewer edits.")
    out.write_text(json.dumps({
        "status": "needs-review", "source": "https://api.crossref.org/works/" + quote(doi, safe=""),
        "review_checklist": ["Correct paper and author identities", "Lab relevance", "No duplicate preprint/published version", "Correct venue, year and links"],
        "publication": candidate,
    }, indent=2, ensure_ascii=False) + "\n")
    print(f"Proposal saved to {out}. Review before adding it to content/publications.json.")


if __name__ == "__main__":
    main()
