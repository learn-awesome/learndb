<script>
    import Icon from "./tailwindui/Icon.svelte"
    import BookCard from "./BookCard.svelte"
    import VideoCard from "./VideoCard.svelte"
    import GenericCard from "./GenericCard.svelte"
    export let item;
    export let displayType = null;
</script>

<!-- <a class="flex flex-col mb-8 bg-gray-700 justify-between overflow-hidden text-gray-50 p-2 rounded-lg max-w-sm w-96" href="#/item/{item.rowid}">
  <div class="flex flex-col justify-center">
    
    {#if item.image}
    
    <img class="h-64 w-44 object-contain py-2 mb-6 float-left rounded-md transform transition ease-out duration-300 hover:scale-105" 
    src={item.image} alt="{item.name}">
    
    
    {:else if item.links.includes('book|')}
    
    <div class="h-64 w-44 text-center pt-5 px-3 book text-gray-50">
      <h1 class="font-extrabold text-lg flex-wrap">{item.name}</h1>
    </div>

    {:else if item.links.includes('course|')}
    
    <div class="h-64 w-44 text-center pt-5 px-3 course text-gray-50">
      <h1 class="font-extrabold text-lg flex-wrap">{item.name}</h1>
    </div>
    
    {/if}  
  </div>
   
  <div>
    <h1 class="font-bold flex-wrap">{item.name}</h1>
    <sl-rating style="--symbol-size: 1rem" readonly precision="0.1" value={item.rating}></sl-rating>
  
    <div class="flex items-center justify-start gap-3 text-gray-500 mt-5">
      {#each item.links.split(";") as type}
      <a href={type.split("|")[1]} class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-cyan-800 text-gray-50" target="_blank"> {type.split("|")[0]} 
        <span class="ml-0.5"><Icon kind="link"/></span>
      </a>
      {/each}
    </div>
  </div>
</a>


<style>
  .book{
    background-image: url(../static/book-cover.png);
  }
  .course{
    background-image: url(../static/course.jpg);
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>  -->


{#if item.links.includes('book|') && item.links.includes('video|')}
  {#if displayType == 'video'}
    <VideoCard {item}/>
  {:else}
    <BookCard {item}/>
  {/if}
{:else if item.links.includes('book|')}
  <BookCard {item}/>
{:else if item.links.includes('video|')}
  <VideoCard {item}/>
{:else}
  <GenericCard {item}/>
{/if}