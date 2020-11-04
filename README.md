# Behavioral Data Science Site

This is the website of our academic research group at UW CSE. It is based on the template provided by the [Allan Lab at Leiden University](https://www.allanlab.org/aboutwebsite.html).

## Modifying this Site
This website is powered by [Jekyll](https://jekyllrb.com/) and some Bootstrap. To work on the site, clone this repo. If you want to preview your changes before committing them (recommended) you will need to install Jekyll and run a local server in your root directory with `jekyll serve`. 

### Adding a Member
Run `python add_person.py` from the root directory, and follow the prompts as they come up.

### Adding a publication 
Run `python add_pub.py` from the root directory, and follow the prompts as they come up.

### Adding a News Item
News items should be manually edited in the `_data/news.yml` collection. 

### Contibuting your changes
Since the site is hosted with github pages, anything in the master branch is live (in production). When you make changes, create a new branch and make a pull request [(tutorial here)](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request). If there aren't any common problems then maybe soon anyone from bdata will be able to merge with master, but for now we'll limit it. 

Copyright Allan Lab. Code released under the MIT License.

