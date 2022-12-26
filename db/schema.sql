DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS creators;

CREATE TABLE topics (
	name VARCHAR(255) PRIMARY KEY, -- url-friendly unique slug
	hname VARCHAR(255), -- human-readable name, allow null, use name
	parent_name VARCHAR(255), -- create a hierarchy with self-reference
	sort_index INTEGER, -- used for sorting children of a parent
	FOREIGN KEY (parent_name) REFERENCES topics(name)
);

CREATE TABLE creators (
	name VARCHAR(255) PRIMARY KEY, -- readable, but url-friendly and unique name eg: bill_gates_1
	hname VARCHAR(255) NOT NULL,
	description TEXT,
	image VARCHAR(1024),
	tags TEXT[] NOT NULL,
	links TEXT[] NOT NULL
);


CREATE TABLE items (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	hname VARCHAR(1024) NOT NULL,
	description TEXT, -- in markdown
	image VARCHAR(1024),
	tags TEXT[] NOT NULL, -- eg: oer, nsfw, free/paid etc
	links TEXT[] NOT NULL, -- json array of {item_type|url|tags}
	topics TEXT[] NOT NULL, -- json array of topic names
	creators TEXT[] NOT NULL, -- json array of creator_ids
	year VARCHAR(32),
	level INTEGER,
	cost TEXT,
	rating INTEGER, -- scale of 1 to 100, divide by 10 if needed
	reviews jsonb DEFAULT '[]' NOT NULL, -- item:id or creator:id, rating,blurb,url

	CHECK (
		jsonb_matches_schema(
			schema := '{
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
			}',
			instance := reviews
		)
	)
);

-- Dump from database to JSON files
-- COPY (
--   SELECT json_agg(row_to_json(topics)) :: text
--   FROM topics
-- ) to '/Users/eshnil/code/learndb/db/topics.json';

-- COPY (
--   SELECT json_agg(row_to_json(creators)) :: text
--   FROM creators
-- ) to '/Users/eshnil/code/learndb/db/creators.json';

-- COPY (
--   SELECT json_agg(row_to_json(items)) :: text
--   FROM items
-- ) to '/Users/eshnil/code/learndb/db/items.json';

