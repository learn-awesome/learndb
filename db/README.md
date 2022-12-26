# JSON format

## topics.json

`name` is used as primary key and therefore, must be unique and avoid uppercase and special characters other than hyphen and slash. Here are some examples: `physics`, `linear-algebra`, `nations/india`, `programming-languages/objective-c`.

`display_name` is used as human-readable name and can preserve uppercase. For eg: `ADHD`.

`parent_id` should be the name of the parent topic. This makes it possible to show a hierarchical view. If a topic does not have `parent_id`, it would be at the top-level but if it doesn't have children topics of its own, it will be clubbed under a dummy top-level topic called `Misc`.

`sort_index` is an integer that's used for controlling the ordering in which topics are displayed.


## items.json

`iid` should be a unique UUID. It is needed because `reviews.js` needs to refer to items and there is no other natural primary key. Later, if we'd want to build collections of items, the same `iid` key would be helpful.

`description` can contain markdown with multiple lines.

`links` is an array value separated by `;`. Each item in this array is `format`, `url` and optional identifiers separated by `|`. For eg, `links` can have a value like this: `summary|https://sivers.org/book/Decisive|ipfs:bafykbzaceaejt6z54qnwnl3ccvw2lsdfksbeuwuh4sv77ixj4c3ldeof2c5so?filename=Daniel%20Higginbotham%20-%20Clojure%20for%20the%20Brave%20and%20True-No%20Starch%20Press%20%282015%29.pdf;book|https://www.goodreads.com/book/show/15798078-decisive;summary|https://fourminutebooks.com/decisive-summary/|doi:https://doi.org/10.2307/2687687`.

Currently `ipfs:` and `doi:` identifiers are supported. In future, ISBN can also be supported using the `isbn:` or `isbn13:` schemes.

`topics` is a array value of topic names separated by `;`. These should exactly match `topics` table's `name` column.

`creators` is arbitrary string for now. For eg: `Charles Darwin`. In future, this might become a full record on its own including fields like `name`,`website`,`twitter`,`email`. In that case, we will have to somehow figure out unique key for each creator that could serve the role of primary key and foreign key.

`difficulty` must be empty or one of these: `childlike`, `beginner`, `intermediate`, `advanced`, `research`.

`rating` is on a 5.0 point scale with up to two decimal places allowed. This is a curated value and should not be simply copied from external sources.

`tags` can describe quality: `visual`, `entertaining`, `challenging`, `inspirational`, `interactive`, `oer`. `oer` stands for "Open Educational Resource" and can be used if the linked content does not require payment or user login.

## reviews.json

`item_id` is a foreign key to `items.js`.
`by` is the name of the person or item.
`blurb` is small description in markdown format.