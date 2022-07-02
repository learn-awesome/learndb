<script>
  import ItemList from '../item-list/ItemList.svelte';
  import TopicMasonryGrid from '../topic-gallery/TopicMasonryGrid.svelte';

  import SearchForm from '../search-form/SearchForm.svelte';
  import { io_fetchItemsWithTopic } from '../../io';

  export let topicname;
  export let alltopics;

  let items = [];
  let filteredItems = [];

  console.log('topicname', topicname);
  let query = {
    text: '',
    topic: '',
    level: '',
    tag: '',
    sortby: 'rating',
  };

  $: io_fetchItemsWithTopic(topicname, (d) => {
    items = [...d];
    filteredItems = [...d];
  });

  function handleQueryChanged(event) {
    // console.log("queryChanged: ", event.detail);
    query = event.detail;
  }

  $: filteredItems = items
    .filter((item) => {
      if (query.text && !item.name.toLowerCase().includes(query.text.toLowerCase())) {
        return false;
      }
      if (query.level && item.difficulty != query.level) {
        return false;
      }
      if (query.tag && !item.tags.includes(query.tag)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (query.sortby == 'rating') {
        return a.rating - b.rating;
      }
      if (query.sortby == 'year') {
        return a.year - b.year;
      }
      if (query.sortby == 'name') {
        return a.name.localeCompare(b.name);
      }
    });
</script>

<TopicMasonryGrid {topicname} {alltopics} />

<div>
  <SearchForm {alltopics} on:queryChanged={handleQueryChanged} hideTopic={true} hideFormat={true} />

  <ItemList items={filteredItems} />
</div>
