#!/bin/sh

browserify src/ph-engine.js | uglifyjs > app.js
cp -Rfv app.js ~/projects/super-party-horse-blog/demo
cp -Rfv src/resources/ ~/projects/super-party-horse-blog/demo/resources/
