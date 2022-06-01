# LearnAwesome

An offline-browsable collection of learning resources organized by topics, formats, difficulty level, quality tags etc etc.

## Users

Run `datasette . -o` in the top-level directory to start the datasette serve and open the app in your browser.

## Developers

When you modify the *.csv files in `db/`, you should re-generate the sqlite database with `./generatedb.sh`.
Run `npm run dev` to keep live-building the JS bundle as you edit the source code.

## Architecture

The dataset here is identical to https://learnawesome.org/. But this runs on your computer so there are no user accounts, no social features like learning feeds or ActivityPub. Your bookmarks will be saved in browser's localStorage.

The source data is in `db/*.csv` files. This is imported into a sqlite database with `./generatedb.sh`.
We then rely on datasette to load this file and offer JSON APIs over HTTP.
Settings and metadata are specified in `settings.json` and `metadata.json` which datasette uses.

For the front-end, we write Svelte components in `src` and generate `bundle.js` and `bundle.css` via `npm run dev` / `npm run build`.

These bundles are then used by `templates/index.html` which datasette loads on the first visit. We keep a second database file `dummy.db` in the same directory so that datasette opens `/` and not `/learn`.

For UI, we make use of TailwindCSS (currently loaded via CDN with some plugins) and Shoelace.Style. Whenever possible, we use Shoelace's existing components.