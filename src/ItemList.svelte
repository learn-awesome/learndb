<script>
    import { onMount } from 'svelte';
    import ItemCard from "./ItemCard.svelte"

    export let kind;
    let ls = null;
    let items = []; //TODO: Only store item IDs in localStorage

    const read = () => !!ls && JSON.parse(ls.getItem(kind) || "[]");

    onMount(() => {
        typeof localStorage !== `undefined` && (ls = localStorage);
        items = read();
    });

</script>

<h1>{kind}</h1>

{#each items as item}
<ItemCard {item}/>
{/each}