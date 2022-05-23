<script>
    import ItemCard from "./ItemCard.svelte"
    import TopicMasonryGrid from "./TopicMasonryGrid.svelte"
    import { formats } from "./formats.js"
    import BookCard from "./BookCard.svelte"
    import VideoCard from "./VideoCard.svelte"
    import GenericCard from "./GenericCard.svelte"

    export let topicname;
    export let alltopics;

    let items = [];

    $: fetch(`/learn/items.json?_shape=array&topics__contains=${topicname}`)
        .then(r => r.json())
        .then(data => {
            items = data;
        });  
</script>


<TopicMasonryGrid {topicname} {alltopics}/>

<!-- <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    {#each items as item}
        <ItemCard {item}/>
    {/each}
</div> -->

<div>
    <div class="">
        <sl-tab-group>
            {#each formats as format}
                <sl-tab slot="nav" panel="general" class="px-2 py-1 bg-gray-900 rounded-md mr-3 mb-3 text-gray-200 shadow hover:text-gray-100 hover:bg-gray-800">{format.name}</sl-tab>

                {#if format.id == 'book'}
                <sl-tab-panel name="general">
                    <div class="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
                        {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                        <BookCard {item}/>
                        {/each}
                    </div>
                </sl-tab-panel>
                

                {:else if format.id == 'video'}
                <sl-tab-panel name="general">
                    <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none xl:grid-cols-3">
                        {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                        <VideoCard {item}/>
                        {/each}    
                    </div>     
                </sl-tab-panel>

                {:else} 
                <sl-tab-panel name="general">
                    <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none xl:grid-cols-3">
                        {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                        <GenericCard {item}/>
                        {/each} 
                    </div>
                </sl-tab-panel>       
                {/if}   
            {/each}
        </sl-tab-group>     
    </div>

    <!-- {#each formats as format} 
        <h1>{format.name}</h1>
        {#if format.id == 'book'}
            <div class="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
                {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                <BookCard {item}/>
                {/each}
            </div>

        {:else if format.id == 'video'}
            <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none xl:grid-cols-3">
                {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                <VideoCard {item}/>
                {/each}    
            </div>     
        {:else} 
            <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none xl:grid-cols-3">
                {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                <GenericCard {item}/>
                {/each} 
            </div>        
        {/if}     
    {/each} -->
</div>


