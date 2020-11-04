import biblib.bib
import biblib.messages
import biblib.algo

import os.path

from shutil import copyfile
from utils import *

PUBS_PATH = "./_publications"
MONTHS = 'January February March April May June July August September October November December'.split()

def clean_entry(ent):

    to_return = {}
    to_return.update(ent)

    if 'title' in ent:
        to_return["title"] = ('  ' + biblib.algo.tex_to_unicode(biblib.algo.title_case(
            ent['title'], pos=ent.field_pos['title'])))

    if 'author' in ent:
        authors = [
            biblib.algo.tex_to_unicode(author.pretty(),
                                       pos=ent.field_pos['author'])
            for author in ent.authors()]
        if len(authors) == 0:
            author = None
        elif len(authors) == 1:
            author = authors[0]
        else:
            author = ', '.join(authors[:-1])
            if len(authors) > 2:
                author += ','
            if ent.authors()[-1].is_others():
                author += ' et al.'
            else:
                author += ' and ' + authors[-1]
        if author:
            to_return["author"] = author

    if 'year' in ent:
        year = ('  {}'.format(ent['year']))
        to_return["year"] = year
    to_return["key"] = ent.key

    return to_return

def build_pub(entry, old_path_to_pdf, old_path_to_thumbnail, description, highlight=False): 
    
    entry_pdf_location, entry_pdf_name = get_entry_pdf_location(entry)
    copyfile(old_path_to_pdf,entry_pdf_location)

    _, thumbnail_file_extension = os.path.splitext(old_path_to_thumbnail)
    entry_thumbnail_location, entry_thumbnail_name = get_entry_thumbnail_location(entry, thumbnail_file_extension)
    copyfile(old_path_to_thumbnail, entry_thumbnail_location)

    pub = {
        "pdf":entry_pdf_name,
        "thumbnail":entry_thumbnail_name,
        "description":description,
        "highlight":int(highlight)
    }
    pub.update(entry)

    pub_path = entry_to_pub_path(entry)
    dump_dict_to_yaml(pub, pub_path)
    return pub_path

def get_entry_pdf_location(entry):
    jekyll_config = load_jeykll_config()
    pdf_dir = os.path.join(jekyll_config["RESOURCES_PATH"], "pubpdfs")
    entry_pdf_location = os.path.join(pdf_dir,entry.key + ".pdf")
    return entry_pdf_location, entry.key + ".pdf"


def get_entry_thumbnail_location(entry, file_extension):
    jekyll_config = load_jeykll_config()
    thumbnail_dir = os.path.join(jekyll_config["RESOURCES_PATH"], "thumbnails")
    entry_thumbnail_location = os.path.join(thumbnail_dir,entry.key + file_extension)
    return entry_thumbnail_location, entry.key + file_extension


def entry_to_pub_path(entry):
    return os.path.join(PUBS_PATH, "{ent.key}.md".format(ent = entry))


def pub_exists(entry):
    pub_path = entry_to_pub_path(entry)
    return os.path.exists(pub_path)


if __name__ == "__main__":
    print("---------------------------")
    print("""This script adds a new publication to the site's 'Publications'
    section. Please provide the following information:""")
    print("---------------------------")
    
    bibtex_path = input("Local path to a text file containing a bibtex item:").strip()
    while not os.path.exists(bibtex_path):
        print("Bibtex item not found. Please try again.")
        bibtex_path = input("Local path to a text file containing a bibtex item:")
    
    with open(bibtex_path) as bibtex_file:
        the_bib = bibtex_file.read()
    db = biblib.bib.Parser().parse(the_bib).get_entries()

    try:
        entry = list(db.values())[0]
    except IndexError:
        exit("Ooops! Something's wrong with your bibtex")
    
    if pub_exists(entry):
        if not y_or_n("An entry for {ent.key} already exists. Do you want to overwrite it?".format(ent=entry)):
            exit()
    
    highlight = y_or_n("Is this a recent publication that should be highlighted?")
    if highlight:
        description = input("Since you're highlighting the paper, provide a brief (50-100 words) description:")
    else:
        description = ""

    #TODO should this be optional?
    old_path_to_pdf = input("Local path to PDF: ").strip()
    while not os.path.exists(old_path_to_pdf):
        print("PDF not found. Please try again.")
        old_path_to_pdf = input("Local path to PDF: ")
    
    old_path_to_thumbnail = input("Local path to thumbnail image: ").strip()
    while not os.path.exists(old_path_to_thumbnail):
        print("Thumbnail not found. Please try again.")
        old_path_to_thumbnail = input("Local path to thumbnail image: ").strip()
    
    pub_path = build_pub(entry, old_path_to_pdf, old_path_to_thumbnail, description, highlight)
    print("Sucessfully created publication entry at {}".format(pub_path))
