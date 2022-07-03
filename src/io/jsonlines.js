import { items } from '../../db-json/items.js';
import { topics } from '../../db-json/topics.js';
import { reviews } from '../../db-json/reviews.js';

/*
{"$_":"8eaaf333","@_":"Anki Decks","»_":"flashcard|https://ankiweb.net/shared/decks/chinese","&_":["l»chinese"],"+_":4.6,"#_":"oer"}
*/
const asItem = (json) => {
  let d = JSON.parse(json);
  const iid = d['$_'];
  const name = d['@_'].replace(/&quot;/g, '"');
  const links = Array.isArray(d['»_']) ? d['»_'].join(';') : d['»_'];
  const description = (d.description || '')
    .replace(/%n/g, '\n')
    .replace(/%t/g, '\t')
    .replace(/&quot;/g, '"');
  const image = d.image || '';
  const topics = Array.isArray(d['&_']) ? d['&_'].join(';') : d['&_'];
  const creators = d.creators || '';
  const year = d.year || '';
  const difficulty = d.difficulty || '';
  const cost = d.cost || '';
  const rating = d['+_'] || '';
  const tags = d['#_'] || '';

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

let throttlePause;
let throttleCallback;

const throttle = (callback, time) => {
  throttleCallback = callback;
  if (throttlePause) return;

  throttlePause = true;
  setTimeout(() => {
    throttleCallback();
    throttlePause = false;
  }, time);
};

const random_item = (arr) => {
  const max = arr.length;
  const idx = Math.min(max - 1, Math.round(Math.random() * max));
  let d = arr[idx];

  return d;
};

const items_db = items.trimStart().trimEnd().split('\n').map(asItem);

export const io_getRandomItemId = (asyncReturn) => {
  asyncReturn(random_item(items_db).iid);
};

export const io_getItemById = (itemid, asyncReturn) => {
  itemid = itemid.split('-')[0];
  const d = items_db.find((d) => d.iid === itemid);
  asyncReturn(d);
};

export const io_fetchItemsWithTopic = (topic, asyncReturn) => {
  if (!topic || !topic.length) asyncReturn([]);
  topic = decodeURI(topic);
  const items = items_db.filter(
    (d) => d.topics.includes(`${topic}»`) || d.topics.split(';').includes(topic)
  );
  asyncReturn(items);
};

export const io_fetchItemsWithLinkTopic = (format, topic, asyncReturn) => {
  if (!format || !format.length) asyncReturn('');
  if (!topic || !topic.length) asyncReturn('');
  topic = decodeURI(topic);
  const items = items_db
    .filter((d) => d.topics.includes(`${topic}»`) || d.topics.split(';').includes(topic))
    .filter((d) => d.links.includes(format));

  asyncReturn(items);
};

export const io_fetchBookmark = (kind, bookmarks, asyncReturn) => {
  if (!kind || !kind.length) asyncReturn([]);
  if (!bookmarks) asyncReturn([]);

  const getIds = (kind, bookmarks) => {
    if (!bookmarks) return '';
    return Object.entries(bookmarks)
      .filter((d) => d[1] == kind)
      .map((d) => d[0]);
  };

  const row_ids = getIds(kind, bookmarks);
  const items = items_db.filter((d) => {
    return row_ids.includes(d.iid);
  });
  asyncReturn(items);
};

export const io_fetchItemWithName = (text, asyncReturn) => {
  text = text.toLowerCase();
  if (!text || !text.length) asyncReturn('');
  const searchItem = () => {
    const items = items_db.filter((d) => {
      return d.name.toLowerCase().includes(text);
    });
    asyncReturn(items);
  };
  asyncReturn('');
  throttle(searchItem, 250);
};

/* --------------------------------
     TOPICS
-------------------------------- */

const asTopic = (json) => {
  let d = JSON.parse(json);
  const name = d['$_'];
  const display_name = d['@_'] || name;
  let image = d['i_'] || '';
  if (image.includes('unsplash://')) {
    const img = image.replace('unsplash://', '');
    image = `https://images.unsplash.com/flagged/photo-${img}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=400`;
  }
  const parent_id = d['^_'] || '';
  const sort_index = d['idx_'];
  d = { name, display_name, image, parent_id, sort_index };
  return d;
};

const topics_db = topics.trimStart().trimEnd().split('\n').map(asTopic);

export const io_getTopicList = (asyncReturn) => {
  asyncReturn([...topics_db]);
};

export const io_getRandomTopicName = (asyncReturn) => {
  asyncReturn(random_item(topics_db).name);
};

export const io_fetchTopicByName = (text, asyncReturn) => {
  if (!text || !text.length) asyncReturn('');
  const d = topics_db.filter((d) => d.name === text || d.name.includes(`${text}»`));
  asyncReturn(d);
};

/* --------------------------------
     REVIEWS
-------------------------------- */

const asReview = (json) => {
  let d = JSON.parse(json);
  const item_id = d.rid;
  const by = d.by || '';
  const blurb = d.blurb || '';
  const rating = d.rating || '';
  const url = d.url || '';
  d = { item_id, by, blurb, rating, url };
  return d;
};
const reviews_db = topics.trimStart().trimEnd().split('\n').map(asReview);

export const io_fetchReviews = (itemid, asyncReturn) => {
  if (!itemid || !itemid.length) asyncReturn('');
  let items = reviews_db.filter((d) => d.item_id === itemid);
  asyncReturn(items);
};
