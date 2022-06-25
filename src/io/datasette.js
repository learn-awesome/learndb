export const io_getRandomItemId = (asyncReturn) => {
  fetch('/learn.json?_shape=array&sql=select+rowid+from+items+order+by+random()+limit+1')
    .then((r) => r.json())
    .then((data) => {
      asyncReturn(data[0].rowid);
    });
};

export const io_getRandomTopicName = (asyncReturn) => {
  fetch('/learn.json?_shape=array&sql=select+name+from+topics+order+by+random()+limit+1')
    .then((r) => r.json())
    .then((data) => {
      asyncReturn(data[0].name);
    });
};

export const io_getTopicList = (asyncReturn) => {
  fetch(`/learn/topics.json?_shape=array&_size=5000`)
    .then((r) => r.json())
    .then(asyncReturn);
};

const encodeArray = (kind, bookmarks) => {
  if (!bookmarks) return '';
  return Object.entries(bookmarks)
    .filter((pair) => pair[1] == kind)
    .map((pair) => pair[0])
    .join('%2C');
};

export const io_fetchBookmark = (kind, bookmarks, asyncReturn) => {
  if (!kind || !kind.length) asyncReturn([]);
  if (!bookmarks) asyncReturn([]);

  fetch(`/learn/items.json?_shape=array&rowid__in=${encodeArray(kind, bookmarks)}`)
    .then((r) => r.json())
    .then(asyncReturn);
};

export const io_fetchItemWithTopic = (format, topic, asyncReturn) => {
  if (!format || !format.length) asyncReturn([]);
  if (!topic || !topic.length) asyncReturn([]);
  fetch(
    `/learn/items.json?_shape=array&_size=100&links__contains=${format}|&topics__contains=${topic}`
  )
    .then((r) => r.json())
    .then(asyncReturn);
};

export const io_getItemById = (itemid, asyncReturn) => {
  if (!itemid || !itemid.length) asyncReturn([]);
  fetch(`/learn/items/${itemid}.json?_shape=object`)
    .then((r) => r.json())
    .then((data) => {
      asyncReturn(data[itemid]);
    });
};

export const io_fetchReviews = (itemid, asyncReturn) => {
  if (!itemid || !itemid.length) asyncReturn([]);
  fetch(`/learn/reviews.json?_shape=array&item_id__exact=${itemid}`)
    .then((r) => r.json())
    .then(asyncReturn);
};

export const io_fetchItemWithName = (text, asyncReturn) => {
  if (!text || !text.length) asyncReturn([]);
  fetch(`/learn/items.json?_shape=array&name__contains=${text}&_size=6`)
    .then((r) => r.json())
    .then(asyncReturn);
};

export const io_fetchTopicByName = (text, asyncReturn) => {
  if (!text || !text.length) asyncReturn([]);
  fetch(`/learn/topics.json?_shape=array&display_name__contains=${text}&_size=6`)
    .then((r) => r.json())
    .then(asyncReturn);
};

export const io_fetchItemsWithTopic = (topic, asyncReturn) => {
  if (!topic || !topic.length) asyncReturn([]);
  fetch(`/learn/items.json?_shape=array&topics__contains=${topic}`)
    .then((r) => r.json())
    .then(asyncReturn);
};
