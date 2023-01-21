DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS creators;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_jsonschema; -- made by supabase

-- TODO: Can we store topics/creators/items images in-place (SVG/Base64) rather than as URLs?

-- TODO: topics.parent_name creates a tree. What if we want a graph or a hypergraph?
-- Should topics have prerequisites globally or only as part of a roadmap?
-- TODO: schema validation for topics.roadmap
CREATE TABLE topics (
	name VARCHAR(255) PRIMARY KEY, -- readable, but url-friendly unique slug, eg: abstract-algebra or nations/india
	hname VARCHAR(255), -- human-readable case-preserving name, allow null, can have special chars
	description TEXT, -- markdown, not in use currently
	image VARCHAR(1024), -- url, not in use currently
	tags TEXT[] NOT NULL, -- for future usage

	parent VARCHAR(255), -- create a hierarchy with self-reference on this table
	rank INTEGER, -- used for sorting children of a parent

	roadmap TEXT, -- A graph of sub-topics combined with recommended items for each sub-topic as a suggested pathway

	FOREIGN KEY (parent) REFERENCES topics(name)
);

CREATE TABLE creators (
	name VARCHAR(255) PRIMARY KEY, -- readable, but url-friendly unique slug eg: bill_gates_1
	hname VARCHAR(255), -- human-readable case-preserving name, allow null, can have special chars
	description TEXT, -- markdown
	image VARCHAR(1024), -- url
	tags TEXT[] NOT NULL, -- occupation (investor/author/scientist/celebrity/entrepreneur etc)

	links TEXT[] NOT NULL -- urls of blogs, twitter/activitypub profiles, homepages etc
);


-- items.id is not referenced from anywhere except as unique key for URLs directly linking to items
-- reviews are now stored in-place in items table, so don't require items.id anymore

-- TODO: How to better model items.topics, items.creators and items.prereqs for many-to-many relationship while enforcing foreign-key constraint?
-- Currently, things will break if topics.name or creators.name is modified without updating items that refer to these

-- TODO: How to model prerequisites? Are they topics or items or both?
-- Should topics have prerequisites?
-- items.prereqs is a array of free-form strings, expected to hold item IDs or topic names

-- TODO: use even shorter uuid? 58^4 = 11.3m unique ids with just 4 characters

CREATE TABLE items (
	id varchar(12) DEFAULT encode(gen_random_bytes(6), 'hex') PRIMARY KEY, -- keeping id so that name does not need to be a unique url-friendly slug
	name VARCHAR(1024) NOT NULL, -- human-readable string (like hname)
	description TEXT, -- markdown
	image VARCHAR(1024),
	tags TEXT[] NOT NULL, -- eg: inspirational, educational, challenging, entertaining, visual, interactive, oer, nsfw, isbn/isbn13

	links TEXT[] NOT NULL, -- array of strings of this format: <item_type>|<url>|<tags>

	prereqs TEXT[] NOT NULL, -- item IDs or topic names
	topics TEXT[] NOT NULL, -- array of topic names (foreign keys, but integrity-check not enforced)
	creators TEXT[] NOT NULL, -- array of creator_ids (foreign keys, but integrity-check not enforced)

	year VARCHAR(32), -- how old is this material?
	level VARCHAR(32), -- what difficulty level is this appropriate for? childlike/beginner/intermediate/advanced/research
	cost TEXT, -- is it free? one-time fees? subscription?

	rating INTEGER, -- scale of 0 to 100, divide by 20 to show on 5-star scale
	reviews jsonb DEFAULT '[]' NOT NULL, -- see json schema below. either by_item or by_creator must be present

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

-- TODO: schema for projects/achievements/skills. How does it map to topics?
-- Are topics actually skills or is a skill actually (topic + level) tuple?

-- TODO: users table with supabase auth, want_to_learn/finished_learning bookmarks, achievements etc.
-- TODO: social graph

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

