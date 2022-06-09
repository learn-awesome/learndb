<script>
    import ItemCard from "./ItemCard.svelte"
    import SearchForm from "./SearchForm.svelte"
    import { formats } from "./formats.js"
import { fix_and_destroy_block } from "svelte/internal";
    
    export let format;
    export let alltopics;
    let items = [];
    let filteredItems = [];

    let query = {
        text: "",
        topic: "",
        level: "",
        tag: "",
        sortby: "rating"
    };

    $: query && fetch(`/learn/items.json?_shape=array&_size=100&links__contains=${format}|&topics__contains=${query.topic}`)
        .then(r => r.json())
        .then(data => {
            items = data;
        });

    function handleQueryChanged(event){
        // console.log("queryChanged: ", event.detail);
        query = event.detail;
    }

    $:  filteredItems = items.filter(item => {
            if(query.text && !item.name.toLowerCase().includes(query.text.toLowerCase())){ return false; }
            if(query.topic && !item.topics.includes(query.topic)){ return false; }
            if(query.level && item.difficulty != query.level){ return false; }
            if(query.tag && !item.tags.includes(query.tag)){ return false; }
            return true;
        }).sort((a,b) => {
            if(query.sortby == 'rating') { return (a.rating - b.rating) };
            if(query.sortby == 'year') { return (a.year - b.year)};
            if(query.sortby == 'name') { return a.name.localeCompare(b.name)};
        });
</script>

<div class="md:flex md:items-center md:justify-between mb-8">
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold leading-7 text-lightSecondary2 sm:text-3xl sm:truncate"> {formats.find((f) => f.id === format).name}</h2>
    </div>
</div>

<SearchForm {alltopics} on:queryChanged={handleQueryChanged} hideFormat={true}/>

{#if format == 'book'}
<div class="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
    {#each filteredItems as item}
    <ItemCard {item} displayType={format}/>
    {/each}
</div>
{:else}
<div class="mt-12 mx-auto gap-5 flex flex-wrap justify-center">
    {#each filteredItems as item}
    <ItemCard {item} displayType={format}/>
    {/each}
</div>
{/if}

