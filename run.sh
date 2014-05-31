#!/bin/sh

browserify src/super-party-horse.js -o app.js
open index.html -a "Google Chrome"
