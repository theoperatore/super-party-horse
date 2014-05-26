#!/bin/sh

browserify src/super-party-horse.js | uglifyjs > app.js
cp -Rfv app.js ~/projects/super-party-horse-blog/demo
cp -Rfv src/resources/ ~/projects/super-party-horse-blog/demo/src/resources/
