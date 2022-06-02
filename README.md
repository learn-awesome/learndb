# LearnAwesome

This is a collection of learning resources organized by topics, formats, difficulty levels, and quality tags like visual / interactive / challenging etc. It also includes reviews from experts and metadata like paywall/loginwall to help you find the best resource for your learning goals.

For certain resources like research paper or books, there will be direct links thanks to projects like InternetArchive, LibGen, Arxiv, SciHub etc.

This requires us to build a giant taxonomy of all human knowledge. Arranging topics in a hierarchy is not sufficient. Instead we are creating a graph of topics and levels with multiple types of edges: "is-a-subtopic-of", "is-a-prerequisite-of" etc. If you are an expert or educator in some domain, you can contribute to this project via our GitHub repository.

In conjunction with this, we're also building an online game where this is presented as a skill-tree for life and allows you to chase ambitious life goals and keep track of your progress while inspiring and being inspired by your friends. More on this will be revealed soon.

## To use:

[Visit https://learnawesome.vercel.app/](https://learnawesome.vercel.app/)

This is the exact same version. Your bookmarks will still be saved in localStorage so be assured that no personal data is being tracked or saved on this site.

But if you'd like faster performance or to self-host this, say in your company's intranet, you need a general-purpose computer (that means Linux/Windows/Mac but not crippled OSes like Android or iOS) with Datasette (which is an exploratory tool for SQLite databases) installed. You can find [installation instructions specific to your operating system here](https://docs.datasette.io/en/stable/installation.html).

After cloning this git repository on your local machine, run `datasette . -o` in the top-level directory to start the datasette serve and open the app in your browser.

## To develop:

When you modify the *.csv files in `db/`, you should re-generate the sqlite database with `./generatedb.sh`.
Run `npm run dev` to keep live-building the JS bundle as you edit the source code.

To publish this on Vercel, we first run `npm run build` followed by `npm run publish`.

## Architecture

The dataset here is identical to https://learnawesome.org/. But there are no user accounts, no social features like learning feeds or ActivityPub. Users' bookmarks are saved in browser's localStorage.

The source data is in `db/*.csv` files. This is imported into a sqlite database with `./generatedb.sh`.
We then rely on datasette to load this file and offer JSON APIs over HTTP.
Settings and metadata are specified in `settings.json` and `metadata.json` which datasette uses.

For the front-end, we write Svelte components in `src` and generate `bundle.js` and `bundle.css` via `npm run dev` / `npm run build`.

These bundles are then used by `templates/index.html` which datasette loads on the first visit. We keep a second database file `dummy.db` in the same directory so that datasette opens `/` and not `/learn`.

For UI, we make use of TailwindCSS (currently loaded via CDN with some plugins) and Shoelace.Style. Whenever possible, we use Shoelace's existing components.