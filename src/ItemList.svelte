<script>
    import BookCard from "./BookCard.svelte"
    import VideoCard from "./VideoCard.svelte"
    import GenericCard from "./GenericCard.svelte"
    export let items = []
    import { formats } from "./formats.js"
</script>


<div class="mt-10">
    <div class="">
        <sl-tab-group placement="start">
            {#each formats.filter(f => items.filter(x => x.links.includes(f.id + '|')).length > 0) as format, i}
                    <sl-tab slot="nav" panel={format.id} active={i == 0}>{format.name}</sl-tab>
                
        
                {#if format.id == 'book'}
                <sl-tab-panel name={format.id} active={i == 0}>
                    <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                        {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                        <BookCard {item}/>
                        {/each}
                    </div>
                </sl-tab-panel>
                
                {:else if format.id == 'video'}
                <sl-tab-panel name={format.id} active={i == 0}>
                    <div class="mx-auto gap-5 flex flex-wrap">
                        {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                        <VideoCard {item}/>
                        {/each}    
                    </div>     
                </sl-tab-panel>

                {:else} 
                <sl-tab-panel name={format.id} active={i == 0}>
                    <div class="mx-auto gap-5 flex flex-wrap">
                        {#each items.filter(x => x.links.includes(format.id + '|')) as item}
                        <GenericCard {item}/>
                        {/each} 
                    </div>
                </sl-tab-panel>       
                {/if}   
            {/each}
        </sl-tab-group>     
    </div>

</div>


<!-- <div class="gap-8 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 mb-8">  
{#each items as item}
<ItemCard {item}/>
{/each}
</div> -->