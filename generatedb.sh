rm learn.db

sqlite-utils insert --alter learn.db topics db/topics.csv --csv
sqlite-utils insert learn.db items db/items.csv --csv
sqlite-utils insert learn.db reviews db/reviews.csv --csv
