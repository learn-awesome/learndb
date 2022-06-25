<script>
  import { onMount } from 'svelte';
  import ItemList from '../item-list/ItemList.svelte';
  import { bookmarks } from '../../stores.js';

  export let kind;
  let items = [];

  onMount(() => {
    // items = read();
  });

  function encodeArray(kind) {
    return Object.entries($bookmarks)
      .filter((pair) => pair[1] == kind)
      .map((pair) => pair[0])
      .join('%2C');
  }

  $: fetch(`/learn/items.json?_shape=array&rowid__in=${encodeArray(kind)}`)
    .then((r) => r.json())
    .then((data) => {
      items = data;
    });
</script>

<h1 class="my-2">{kind == 0 ? 'Want to learn' : 'Finished learning'}</h1>

<ItemList {items} />
