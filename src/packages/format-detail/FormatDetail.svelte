<script>
  import ItemCard from '../item-card/ItemCard.svelte';
  import SearchForm from '../search-form/SearchForm.svelte';
  import { formats } from './formats.js';
  import { io_fetchItemWithTopic } from '../../io/datasette.js';
  export let format;
  export let alltopics;
  let items = [];
  let filteredItems = [];

  let query = {
    text: '',
    topic: '',
    level: '',
    tag: '',
    sortby: 'rating',
  };

  $: query &&
    io_fetchItemWithTopic(format, query.topic, (d) => {
      items = d;
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
      if (query.topic && !item.topics.includes(query.topic)) {
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

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
</script>

<!-- <div class="md:flex md:items-center md:justify-between mb-8">
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold leading-7 text-secondary sm:text-3xl sm:truncate"> 
        {formats.find((f) => f.id === format).name}
      </h2>
    </div>
</div> -->

<div class="my-2 flex flex-row">
  <sl-breadcrumb class="flex-grow">
    <sl-breadcrumb-item href="#/formats" class="title">All Formats</sl-breadcrumb-item>
    <sl-breadcrumb-item href={'#/format/' + format}>
      {capitalize(format)}
    </sl-breadcrumb-item>
  </sl-breadcrumb>
  <a
    href="https://github.com/learn-awesome/learndb"
    target="_blank"
    class="underline text-primary hover:font-bold px-2"
  >
    Help us improve this taxonomy
  </a>
</div>

<SearchForm {alltopics} on:queryChanged={handleQueryChanged} hideFormat={true} />

{#if format == 'book'}
  <div
    class="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 justify-items-center"
  >
    {#each filteredItems as item}
      <ItemCard {item} displayType={format} />
    {/each}
  </div>
{:else}
  <div class="mt-12 mx-auto gap-5 flex flex-wrap justify-center">
    {#each filteredItems as item}
      <ItemCard {item} displayType={format} />
    {/each}
  </div>
{/if}
