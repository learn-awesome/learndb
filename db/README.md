# JSON format

These JSON files can also be generated from a PostgreSQL database whose schema is defined in `schema.sql`.

We have 3 top-level entities: [Topics](topics.json), [Creators](creators.json), [Items](items.json). Reviews are are nested within Items and have links to either another Item or a Creator.

topis (name, hname, parent, rank)
creators (name, hname, links)
items (id, name, description, image, splinks, topics, creators, reviews, tags, difficulty, rating)

spnames are topic names designed to fix many shortcomings of traditional names:
- we want case-insensitive, unique, URL-safe, hashtag-compatible names as topic identifiers
- but case-sensitive and including special characters for human display. Eg: "AT & T" or "C++ 20"
- topics have a taxonomy, typically a hierarchy. For eg: comp.lang.python
- within a parent, we usually want to preserve display order which is not alphabetical. This can be done with names like "100-physics", "200-chemistry", "300-biology" etc.

Wikipedia handles it awkwardly (escape characters that are hard to type manually, no hierarchy):
- https://en.wikipedia.org/wiki/Zorn%27s_lemma
- https://en.wikipedia.org/wiki/C%2B%2B

[Newsgroups](https://www.big-8.org/wiki/Big-8_Usenet_hierarchies) are quite nice, but the taxonomy is not granular enough for us to build a universal knowledge graph. For eg: there is [no name yet](https://news.novabbs.org/usenet/article-flat.php?id=34&group=news.announce.newgroups#34) for quadratic equations. Also, everything other than Big-8 (comp, humanities, misc, news, rec, sci, soc, and talk) is shoved into the alt.* hierarchy (the historical reason for that is European networks did not want to pay for groups like religion or racism)

Taxonomy maintenance is not easy. When does a concept/subtopic deserve its own topic-name? What happens when topics get merged or retired? Should they be language-agnostic or English-first? 

Should names optimize for brevity or readability? What if names get really long?
Should names always fully-specified like `math.algebra.quadratics` or just `quadratics`?
If sort order is included in the name, do we expect the users to write "100-science.200-chemistry"?
If sort order is NOT included in the name then it (and other attributes) needs to be looked up elsewhere.
What if a topic belongs under two separate parent topics? statistics.machine_learning or computer_science.machine_learning?
Can names be compatible with hashtags?
How to handle disambiguation (a name that belongs to 2+ things or a thing that has 2+ names?
How about nameless things or topics?
Should names be meaningful or randomized?
Are names properties (like DNS or ENS)? If not, who assigns them?
How can a taxonomy keep up with expanding knowledge?


splinks are HTTP URLs modified specially in a few ways:
- Link should indicate the learning media type (eg: book/course/video/game/event etc)
- Link should optionally include content-hash for integrity check and alternat fetch mechanism like IPFS
- Link should optionally include enable easy lookup for its snapshot on places like Wayback machine
- Link should optionally indicate its open-access status: 
    - Does it require login?
    - Does it require payment?
    - Does it require ads?
- Links should be backward-compatible and should navigate to primary location in the usual way

## topics.json

`name` is used as primary key and therefore, must be unique and avoid uppercase and special characters other than hyphen and slash. Here are some examples: `physics`, `linear-algebra`, `nations/india`, `programming-languages/objective-c`.

`hname` is used as human-readable name and can preserve uppercase. For eg: `ADHD`.

`parent` should be the name of the parent topic. This makes it possible to show a hierarchical view. If a topic does not have `parent_name`, it would be at the top-level but if it doesn't have children topics of its own, it will be clubbed under a dummy top-level topic called `Misc`.

`rank` is an integer that's used for controlling the ordering in which topics are displayed.

## creators.json

A top-level table that lists well-known experts and their metadata like occupation, links etc. These are references from items and their reviews.
`name` is unique, URL-safe.
`hname` is case-sensitive, allows special characters and may not be unique.

## items.json

`id` should be a unique UUID. It is needed because there is no other natural primary key. This might also be useful later for defining collections of items.

`description` can contain markdown with multiple lines.

`links` is an array of strings. Each item in this array is `format`, `url` and optional identifiers separated by `|`. For eg, one of the strings in `links` might: `summary|https://sivers.org/book/Decisive|ipfs:bafykbzaceaejt6z54qnwnl3ccvw2lsdfksbeuwuh4sv77ixj4c3ldeof2c5so?filename=Daniel%20Higginbotham%20-%20Clojure%20for%20the%20Brave%20and%20True-No%20Starch%20Press%20%282015%29.pdf`.

The use-case for optional identifiers are things like `ipfs:`, `doi:`, `isbn:` or `isbn13:`.

`topics` is an array of topic names. These should exactly match `topics` table's `name` column.

`creators` is an array of strings which are references to the `creators` table's `name` column. For eg: `charles_darwin`.

`difficulty` must be either `null` or one of these: `childlike`, `beginner`, `intermediate`, `advanced`, `research`.

`rating` is an integer on 0-100 point scale. This is a curated value and should not be simply copied from external sources.

`tags` can describe quality: `visual`, `entertaining`, `challenging`, `inspirational`, `interactive`, `oer`. `oer` stands for "Open Educational Resource" and can be used if the linked content does not require payment or user login.

`reviews` is an array of JSON objects that must match this schema as you can see in `schema.sql`:

```
{
	"type": "array",
	"items": {
		"type": "object",
		"properties": {
			"by_item": {"type": ["string", "null"]},
			"by_creator": {"type": ["string", "null"]},
			"rating": {"type": ["integer", "null"], "minimum": 0, "maximum": 100},
			"blurb": {"type": ["string", "null"]},
			"url": {"type": ["string", "null"]}
		}
	}
}
```
