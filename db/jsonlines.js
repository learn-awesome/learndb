import { items } from './items.js';
import { topics } from './topics.js';
import { reviews } from './reviews.js';

const items_db = items.trimStart().trimEnd().split('\n').map(j => JSON.parse(j));
const topics_db = topics.trimStart().trimEnd().split('\n').map(j => JSON.parse(j));
const reviews_db = reviews.trimStart().trimEnd().split('\n').map(j => JSON.parse(j));

export const io_getTopicList = () => {
    return [...topics_db];
}

export const io_getRandomTopicName = () => {
    let randomId = Math.floor(Math.random() * topics_db.length);
    return topics_db[randomId].name;
}

export const io_getTopicByName = (name) => {
    return topics_db.filter(t => t.name === name)[0];
}

export const io_getRandomItemId = () => {
    let randomId = Math.floor(Math.random() * items_db.length);
    return items_db[randomId].iid;
}

export const io_getItemsForTopic = (topicname) => {
    return items_db.filter(i => i.topics.split(";").includes(topicname))
}

export const io_getItem = (iid) => {
    if(!iid) return null;
    return items_db.filter(t => t.iid === iid)[0];
}

export const io_getItemsForTopicAndFormat = (format, topicname) => {
    let results = items_db.filter(i => i.topics.includes(topicname)).filter(i => i.links?.includes(format + "|"));
    return results.slice(0, 100);
}

export const io_getReviewsForItem = (item_id) => {
    if(!item_id) return [];
    return reviews_db.filter(r => r.id === item_id);
}

export const io_getItemsWithIDs = (ids) => {
    let results = items_db.filter(i => ids.includes(i.iid));
    // console.log({ids}, {results});
    return results;
}

export const io_search_items = (query) => {
    if(!query) return [];
    let items = items_db.filter(i => i.name.toLowerCase().includes(query.toLowerCase())).slice(0,6);
    return items;
}

export const io_search_topics = (query) => {
    if(!query) return [];
    let topics = topics_db.filter(t => t.display_name.toLowerCase().includes(query.toLowerCase())).slice(0,6);
    return topics;
}