#!/usr/bin/env python3

import biblib.bib
import argparse
import sys
from collections import OrderedDict
import os

def main():
    arg_parser = argparse.ArgumentParser(
        description='Split apart a bibtex file into multiple files, each containing one entry')
    arg_parser.add_argument('bib', nargs='+', help='.bib file(s) to process',
                            type=open)
    arg_parser.add_argument('out_path',help='out directory', type=str)                          
    arg_parser.add_argument('--author', type=str,
                            help='return only entries that contain an author with this name', default=None)
    args = arg_parser.parse_args()

    try:
        # Load databases
        db = biblib.bib.Parser().parse(args.bib, log_fp=sys.stderr).get_entries()
        if args.author:
            new_db = OrderedDict()
            for (key, value) in db.items():
                if args.author in value.get("author",""):
                    new_db[key] = value
            db = new_db
        
        for key, ent in db.items():
            bib_path = os.path.join(args.out_path, key+".bib")
            with open(bib_path, 'a') as the_file:
                the_file.write(ent.to_bib())
        
    except biblib.messages.InputError:
        sys.exit(1)

    # Pretty-print entries
    for ent in db.values():
        print(ent.to_bib())
        print()

if __name__ == '__main__':
    main()