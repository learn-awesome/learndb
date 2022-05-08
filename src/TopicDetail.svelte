<script>
    import ItemCard from "./ItemCard.svelte"

    export let topic;
    let items = [];

    $: fetch(`/learn/items.json?_shape=array&topics__contains=${topic}`)
        .then(r => r.json())
        .then(data => {
            items = data;
        });
</script>

<div class="md:flex md:items-center md:justify-between mb-8">
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{topic}</h2>
    </div>
</div>


{#each items as item}
    <ItemCard {item}/>
{/each}
