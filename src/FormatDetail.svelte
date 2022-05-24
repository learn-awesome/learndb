<script>
    import ItemCard from "./ItemCard.svelte"

    export let format;
    export let alltopics;
    let items = [];

    $: fetch(`/learn/items.json?_shape=array&links__contains=${format}|`)
        .then(r => r.json())
        .then(data => {
            items = data;
        });
</script>

<div class="md:flex md:items-center md:justify-between mb-8">
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold leading-7 text-gray-100 sm:text-3xl sm:truncate"> {format}</h2>
    </div>
</div>

{#if format == 'book'}
<div class="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 justify-items-center">
    {#each items as item}
    <ItemCard {item} displayType={format}/>
    {/each}
</div>
{:else}
<div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none xl:grid-cols-3">
    {#each items as item}
    <ItemCard {item} displayType={format}/>
    {/each}
</div>
{/if}

