# JSON format

These JSON files are now not the master data but will be generated from a PostgreSQL database whose schema is defined in `schema.sql`.

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

`topics` is a array of topic names. These should exactly match `topics` table's `name` column.

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
