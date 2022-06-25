<script>
  import { onMount } from 'svelte';
  import ItemList from '../item-list/ItemList.svelte';
  import { bookmarks } from '../stores.js';
  import { io_fetchBookmark } from '../../io';

  export let kind;
  let items = [];

  onMount(() => {
    // items = read();
  });

  $: io_fetchBookmark(kind, $bookmarks, (d) => {
    items = d;
  });
</script>

<h1 class="my-2">{kind == 0 ? 'Want to learn' : 'Finished learning'}</h1>

<ItemList {items} />
