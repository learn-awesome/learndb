rm learn.db

sqlite-utils insert learn.db topics db/topics1.csv --csv
sqlite-utils insert learn.db topics db/topics2.csv --csv

sqlite-utils insert learn.db items db/items.csv --csv

sqlite-utils insert learn.db reviews db/reviews1.csv --csv
sqlite-utils insert learn.db reviews db/reviews2.csv --csv
