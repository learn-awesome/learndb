PRAGMA foreign_keys=OFF;

CREATE TABLE topics (
	name VARCHAR(255) PRIMARY KEY, -- url-friendly slug
	display_name VARCHAR(255), -- allow null, use name
	parent_name VARCHAR(255), -- create a hierarchy with self-reference
	sort_index INTEGER, -- used for sorting children of a parent
	FOREIGN KEY (parent_name) REFERENCES topics(name)
);

CREATE TABLE creators (
	id VARCHAR(255) PRIMARY KEY,
	name VARCHAR(1024) NOT NULL,
	image_url VARCHAR(1024),
	bio TEXT,
	occupation VARCHAR(255),
	links TEXT
);

CREATE TABLE items (
	id VARCHAR(255) PRIMARY KEY, -- uuid
	name VARCHAR(1024) NOT NULL,
	description VARCHAR(4096), -- in markdown
	image_url VARCHAR(1024),
	links TEXT NOT NULL, -- json array of {item_type, url, misc}
	topics TEXT NOT NULL, -- json array of topic names
	creators TEXT, -- json array of creator_ids
	year varchar(32),
	difficulty INTEGER,
	cost TEXT,
	rating INTEGER, -- scale of 1 to 100, divide by 10 if needed
	tags TEXT
);

CREATE TABLE reviews (
	item_id VARCHAR(255) NOT NULL,
	by_item VARCHAR(255),
	by_creator VARCHAR(255),
	rating INTEGER, -- scale of 1 to 100, divide by 10 if needed
	blurb TEXT,
	url VARCHAR(1024),
	PRIMARY KEY (item_id, by_item, by_creator),
	FOREIGN KEY (item_id) REFERENCES items(id),
	FOREIGN KEY (by_item) REFERENCES items(id),
	FOREIGN KEY (by_creator) REFERENCES creators(id),
	CHECK(by_item IS NOT NULL OR by_creator IS NOT NULL) -- one of the two must be present. Ideally both.
)