#!/bin/bash

set -e

# Workaund to make routing working on reload
cd dist
cp index.html 404.html
cd ..

# Pushing dist folder to gh-pages
git add dist -f
git commit -m "deploy: adding latest dist"
git subtree split --prefix dist -b gh-pages
git push -f origin gh-pages
git branch -D gh-pages
