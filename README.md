# Learndb

Non-social version of https://learnawesome.org/

Run `datasette . -o` in the top-level directory.

Schema:
  - Format: inline string like book, course, video, audio, podcast, newsletter, game, toy, website, article etc
  - Topic (id - using slash or dot separator for hierarchy, display_name, image)
    - Why not an inline string?
      - Need to support Special characters (dot, hyphen etc), preserve capitalization etc
    - Hierarchy may change over time
  - Item (id, name, description, image, []{format, URL/hash}, rating, topic_id: [], creator_ids: [], year, difficulty, cost, quality_tags, extra_data: {})
  - Creator (id, name, description, category, social_urls_or_ids, photo)
  - Review/Recommendation (id, item_id, by: item_id/creator_id, rating, blurb, URL, quality_tags)

Additional pages:
- Syllabus page per topic
- Format page

To generate the sqlite database from the source files, run `generatedb.sh`
