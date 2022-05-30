# LearnAwesome

An offline-browsable collection of learning resources organized by topics, formats, difficulty level etc.

## Users

Run `datasette . -o` in the top-level directory which opens the Datasette default view. Click on "home" in the top-left to open the custom UI which is much nicer.

## Developers

When you modify the *.csv files in `db/`, generate the sqlite database with `./generatedb.sh`.
Run `npm run dev` to keep building the JS bundle as you edit the source code.

## Details

The dataset here is identical to https://learnawesome.org/. But this runs on your computer so there are no user accounts, no social features like learning feeds or ActivityPub. Your bookmarks will be saved in browser's localStorage.