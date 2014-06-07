#!/bin/sh

browserify src/super-party-horse.js | uglifyjs > app.js
cp -Rfv app.js ~/projects/super-party-horse-blog/demo
cp -Rfv src/resources/ ~/projects/super-party-horse-blog/demo/src/resources/
cd ~/projects/super-party-horse-blog
git add ~/projects/super-party-horse-blog/demo
git commit -m "updated demo to latest version"
git push origin gh-pages
