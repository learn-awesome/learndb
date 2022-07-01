import { items } from '../../db-json/items.js';

const items_db = items.trimStart().trimEnd().split('\n');

const random_item = (arr) => {
  const max = arr.length;
  const idx = Math.min(max - 1, Math.round(Math.random() * max));
  let d = arr[idx];
  if (!d || !d.length) {
    d = random_item(arr);
  }
  return d;
};

/*
{"$_":"8eaaf333","@_":"Anki Decks","»_":"flashcard|https://ankiweb.net/shared/decks/chinese","&_":["l»chinese"],"+_":4.6,"#_":"oer"}
*/
const asItem = (json) => {
  console.log('- json ----', json);
  let d = JSON.parse(json);
  const iid = d['$_'];
  const name = d['@_'];
  const links = Array.isArray(d['»_']) ? d['»_'].join(';') : d['»_'];
  const description = d.description;
  const image = d.image;
  const topics = Array.isArray(d['&_']) ? d['&_'].join(';') : d['&_'];
  const creators = d.creators;
  const year = d.year;
  const difficulty = d.difficulty;
  const cost = d.cost;
  const rating = d['+_'];
  const tags = d['#_'];

  d = {
    iid,
    name,
    description,
    image,
    links,
    topics,
    creators,
    year,
    difficulty,
    cost,
    rating,
    tags,
  };

  return d;
};

export const io_getRandomItemId = (asyncReturn) => {
  asyncReturn(asItem(random_item(items_db)).iid);
};

const item = {
  rowid: 12420,
  iid: '858b0507-c1a3-4c37-94d0-26bfdf461213',
  name: 'Irrigation and Drainage Engineering',
  description: 'By Peter Waller, Muluneh Yitayew',
  image: '',
  links: 'book|http://link.springer.com/openurl?genre=book&isbn=978-3-319-05699-9',
  topics: 'civil-engineering;irrigation;drainage',
  creators: '',
  year: '',
  difficulty: '',
  cost: '',
  rating: '',
  tags: '',
};

export const io_getItemById = (itemid, asyncReturn) => {
  itemid = itemid.split('-')[0];
  const d = items_db.filter((d) => d.includes(itemid)).filter((d) => asItem(d).iid === itemid);
  console.log('io_getItemById', itemid, '--', d);
  asyncReturn(asItem(d));
};

export const io_fetchItemsWithTopic = (topic, asyncReturn) => {
  console.log('---io_fetchItemsWithTopic---------');
  if (!topic || !topic.length) asyncReturn([]);

  const items = items_db
    .filter((d) => d.includes(topic))
    .map(asItem)
    .filter((d) => d.topics.includes(topic));
  asyncReturn(items);
};
