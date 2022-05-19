<script>
    import { onMount } from 'svelte';
    import ItemCard from "./ItemCard.svelte"
    import { bookmarks } from "./stores.js"

    export let kind;
    let items = []

    onMount(() => {
        // items = read();
    });

    function encodeArray(kind){
        console.log($bookmarks)
        return Object.entries($bookmarks).filter(pair => pair[1] == kind).map(pair => pair[0]).join("%2C")
    }

    $: fetch(`/learn/items.json?_shape=array&rowid__in=${encodeArray(kind)}`)
        .then(r => r.json())
        .then(data => {
            items = data;
        });  

</script>

<h1>{kind == 0 ? 'Want to learn' : 'Finished learning'}</h1>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
{#each items as item}
<ItemCard {item}/>
{/each}
</div>