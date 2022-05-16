<script>
    import ItemCard from "./ItemCard.svelte"
    import TopicMasonryGrid from "./TopicMasonryGrid.svelte"

    export let topicid;
    let items = [];

    $: fetch(`/learn/items.json?_shape=array&topics__contains=${topicid}`)
        .then(r => r.json())
        .then(data => {
            items = data;
        });  
</script>


<TopicMasonryGrid {topicid}/>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    {#each items as item}
        <ItemCard {item}/>
    {/each}
</div>

