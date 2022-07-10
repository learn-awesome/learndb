<script>
    import { onMount } from 'svelte';
    import ItemList from "./ItemList.svelte"
    import { bookmarks } from "./stores.js"
    import { io_getItemsWithIDs } from "../db/jsonlines.js"

    export let kind;

    $: items = io_getItemsWithIDs(Object.entries($bookmarks).filter(pair => pair[1] == kind).map(pair => pair[0]));

</script>

<h1 class="my-2">{kind == 0 ? 'Want to learn' : 'Finished learning'}</h1>

<ItemList {items}/>