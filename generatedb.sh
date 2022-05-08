rm learn.db
sqlite-utils insert learn.db creators db/creators.csv --csv
sqlite-utils insert learn.db topics db/topics.csv --csv
sqlite-utils insert learn.db items db/items.csv --csv
sqlite-utils insert learn.db reviews db/reviews.csv --csv
sqlite-utils insert learn.db courses db/courses.csv --csv