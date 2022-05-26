<script>
    import ItemCard from "./ItemCard.svelte"
    import TopicMasonryGrid from "./TopicMasonryGrid.svelte"
    import { formats } from "./formats.js"
    import BookCard from "./BookCard.svelte"
    import VideoCard from "./VideoCard.svelte"
    import GenericCard from "./GenericCard.svelte"
    import SearchForm from "./SearchForm.svelte"

    export let topicname;
    export let alltopics;

    let items = [];
    let filteredItems = [];

    let query = {
        text: "",
        topic: "",
        format: "",
        level: "",
        sortby: "rating"
    };

    $: fetch(`/learn/items.json?_shape=array&topics__contains=${topicname}`)
        .then(r => r.json())
        .then(data => {
            items = data;
            filteredItems = data;
        });  
    
    function handleQueryChanged(event){
        console.log("queryChanged: ", event.detail);
        query = event.detail;
    }

    $:  filteredItems = items.filter(item => {
            if(query.text && !item.name.toLowerCase().includes(query.text.toLowerCase())){ return false; }
            if(query.format && !item.links.includes(query.format)) { return false; }
            if(query.level && item.difficulty != query.level){ return false; }
            return true;
        }).sort((a,b) => {
            if(query.sortby == 'rating') { return (a.rating - b.rating) };
            if(query.sortby == 'year') { return (a.year - b.year)};
            if(query.sortby == 'name') { return a.name.localeCompare(b.name)};
        });
    
</script>

<SearchForm {alltopics} on:queryChanged={handleQueryChanged}/>

<TopicMasonryGrid {topicname} {alltopics}/>

<!-- <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    {#each items as item}
        <ItemCard {item}/>
    {/each}
</div> -->

<div>
    <div class="">
        <sl-tab-group placement="start">
            {#each formats.filter(f => items.filter(x => x.links.includes(f.id + '|')).length > 0) as format}
                    <sl-tab slot="nav" panel="{format.id}" class="">{format.name}</sl-tab>
                
        
                {#if format.id == 'book'}
                <sl-tab-panel name="{format.id}">
                    <div class="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
<<<<<<< HEAD
                        {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                        
=======
                        {#each filteredItems.filter(x => x.links.includes(format.id + '|')) as item}
>>>>>>> upstream/main
                        <BookCard {item}/>
                        {/each}
                    </div>
                </sl-tab-panel>
                
                {:else if format.id == 'video'}
                <sl-tab-panel name="{format.id}">
                    <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none xl:grid-cols-3">
                        {#each filteredItems.filter(x => x.links.includes(format.id + '|')) as item}
                        <VideoCard {item}/>
                        {/each}    
                    </div>     
                </sl-tab-panel>

                {:else} 
                <sl-tab-panel name="{format.id}">
                    <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none xl:grid-cols-3">
                        {#each filteredItems.filter(x => x.links.includes(format.id + '|')) as item}
                        <GenericCard {item}/>
                        {/each} 
                    </div>
                </sl-tab-panel>       
                {/if}   
            {/each}
        </sl-tab-group>     
    </div>

</div>


