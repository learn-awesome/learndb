# LearnAwesome

[Visit the online version at https://learndb.vercel.app/](https://learndb.vercel.app/) but you can also run it on your own machine.

This is a collection of learning resources organized by topics, formats, difficulty levels, and quality tags like visual / interactive / challenging etc. It also includes reviews from experts and metadata like paywall/loginwall to help you find the best resource for your learning goals.

For certain resources like research paper or books, there will be direct links thanks to projects like InternetArchive, LibGen, Arxiv, SciHub etc.

This requires us to build a giant taxonomy of all human knowledge. Arranging topics in a hierarchy is not sufficient. Instead we are creating a graph of topics and levels with multiple types of edges: "is-a-subtopic-of", "is-a-prerequisite-of" etc. If you are an expert or educator in some domain, you can contribute to this project via our GitHub repository.

In conjunction with this, we're also building an online game where this is presented as a skill-tree for life and allows you to chase ambitious life goals and keep track of your progress while inspiring and being inspired by your friends. More on this will be revealed soon.

## To use:

[Visit https://learndb.vercel.app/](https://learndb.vercel.app/)

<img width="1699" alt="image" src="https://user-images.githubusercontent.com/19304/173263135-a3a02843-93d0-4c9c-b84f-a42b4883ff66.png">

<img width="1694" alt="image" src="https://user-images.githubusercontent.com/19304/173263184-2b72e006-91f1-43d6-9bde-3d151272e177.png">

<img width="1682" alt="image" src="https://user-images.githubusercontent.com/19304/173263247-275ef166-ee59-4ba9-8123-f0e7e6d19988.png">


Your bookmarks are saved in localStorage so be assured that no personal data is being tracked or saved on this site.

But if you'd like faster performance or to self-host this, you need a general-purpose computer (that means Linux/Windows/Mac) with Datasette (which is an exploratory tool for SQLite databases) installed. You can find [installation instructions specific to your operating system here](https://docs.datasette.io/en/stable/installation.html).

After cloning this git repository on your local machine, run `npm run start` in the top-level directory to start the datasette server and open the app in your browser.

## To contribute:

This is a Wikipedia-scale project and we could use all kind of help:

- Spread word about this project among your friends, family, colleagues and online followers
- To donate funds, [visit our OpenCollective](https://opencollective.com/learnawesome)
- To report bugs, [create an issue](https://github.com/learn-awesome/learndb/issues)
- To improve our topic taxonomy (improve sub-topics / prerequisites etc), [raise a PR on our Github with changes in `db/topics.js` file](https://github.com/learn-awesome/learndb/tree/main/db)
- To improve the data about learning resources, first read [db/README.md](db/README.md) and [raise a PR on our Github with changes in `db/items.js` file](https://github.com/learn-awesome/learndb/tree/main/db)
- To improve design and suggest features, [start a discussion](https://github.com/learn-awesome/learndb/discussions)
- To fix technical bugs, [propose solutions on the issues](https://github.com/learn-awesome/learndb/issues)
- For anything else, [start a discussion](https://github.com/learn-awesome/learndb/discussions)



## Architecture

The dataset here is identical to https://learnawesome.org/. But there are no user accounts, no social features like learning feeds or ActivityPub. Users' bookmarks are saved in browser's localStorage.

The source data is in `db/*.js` files. The schema is described in [db/README.md](db/README.md).
For the front-end, we write Svelte components in `src` and generate `bundle.js` and `bundle.css` via `npm run dev` / `npm run build`.

For UI, we make use of TailwindCSS (currently loaded via CDN with some plugins) and Shoelace.Style. Whenever possible, we use Shoelace's existing components.
