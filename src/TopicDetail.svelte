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


{#each items as item}
    <ItemCard {item}/>
{/each}
