<script>
	import { createEventDispatcher } from 'svelte';
  import Icon from "./Icon.svelte"
  const dispatch = createEventDispatcher();

  let query = '';
  let result_items = [];
  let result_topics = [];

  let elm;

  function resetQuery(){
    query = '';
    result_items=[];
    result_topics=[];
  }

  $: query && fetch(`/learn/items.json?_shape=array&name__contains=${query}&_size=6`)
        .then(r => r.json())
        .then(data => {
            result_items = data;
        });

  $: query && fetch(`/learn/topics.json?_shape=array&display_name__contains=${query}&_size=6`)
        .then(r => r.json())
        .then(data => {
            result_topics = data;
        });
  
  $: elm && elm.focus();
  

</script>

<!-- <sl-dialog no-header open={showSearch} style="--header-spacing: 0px; --body-spacing: 0px; --footer-spacing: 0px" on:sl-hide="{e => dispatch('closed',{})}">
  <div class="transform overflow-hidden rounded-xl bg-primary_light shadow-2xl ring-1 ring-black ring-opacity-5 transition-all fixed top-32 sm:inset-x-auto w-72 md:w-96">
    <div class="relative">
      
      <svg class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
      <input bind:this={elm} bind:value={query} type="text" class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." role="combobox" aria-expanded="false" aria-controls="options" >
    </div>

    {#if !query }
   
    <div class="border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
      
      <svg class="mx-auto h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="mt-4 font-semibold text-gray-900">Search for items, topics and creators</p>
      <p class="mt-2 text-gray-500">Quickly look for resources by running a global search.</p>
    </div>
    
    {:else if result_items.length + result_topics.length > 0}

    
    <ul class="scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2" id="options" role="listbox">
      {#if result_topics.length > 0}
      <li>
        <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900 text-center">Topics</h2>
        <ul class="mt-2 text-sm text-gray-800">
            {#each result_topics as topic}
            <li><a href="#/topic/{topic.name}" on:click={resetQuery} class="block cursor-default select-none px-4 py-2 hover:bg-lightTertiary hover:text-white cursor-pointer" role="option" tabindex="-1">{topic.display_name}</a></li>
            {/each}
        </ul>
      </li>
      {/if}
      {#if result_items.length > 0}
      <li>
        <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900 text-center">Items</h2>
        <ul class="mt-2 text-sm text-gray-800">
          {#each result_items as item}
          <li><a href="#/item/{item.rowid}" on:click={resetQuery} class="block cursor-default select-none px-4 py-2 hover:bg-lightTertiary hover:text-white cursor-pointer" role="option" tabindex="-1">{item.name}</a></li>
          {/each}
        </ul>
      </li>
      {/if}
      
    </ul>

    {:else}

   
    <div class="border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
     
      <svg class="mx-auto h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="mt-4 font-semibold text-gray-900">No results found</p>
      <p class="mt-2 text-gray-500">We couldn’t find anything with that term. Please try again.</p>
    </div>

    {/if}
  </div>
</sl-dialog> -->

<form class="hidden w-full md:pl-24 md:flex justify-center" on:submit|preventDefault>
  <div class="fixed top-2">
    <div class="transform overflow-hidden rounded-md bg-primary_light shadow-2xl ring-1 ring-black ring-opacity-5 transition-all w-96">
      <div class="relative">
        <svg class="pointer-events-none absolute top-3.5 left-4 h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        
        
        <input bind:this={elm} bind:value={query} type="text" class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." role="combobox" aria-expanded="false" aria-controls="options" >
      </div>
          
      {#if result_items.length + result_topics.length > 0}    
      
      <button class="absolute top-3.5 right-4 text-primary" on:click="{e => resetQuery()}">
        <span class="sr-only">Close search</span>
        <Icon kind="close"/>
      </button>

      <ul class="scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2" id="options" role="listbox">
        {#if result_topics.length > 0}
        <li>
          <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900 text-center">Topics</h2>
          <ul class="mt-2 text-sm text-gray-800">
              {#each result_topics as topic}
              <li><a href="#/topic/{topic.name}" on:click={resetQuery} class="block cursor-default select-none px-4 py-2 hover:bg-primary hover:text-primary_light cursor-pointer" role="option" tabindex="-1">{topic.display_name}</a></li>
              {/each}
          </ul>
        </li>
        {/if}
        {#if result_items.length > 0}
        <li>
          <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900 text-center">Items</h2>
          <ul class="mt-2 text-sm text-gray-800">
            {#each result_items as item}
            <li><a href="#/item/{item.rowid}" on:click={resetQuery} class="block cursor-default select-none px-4 py-2 hover:bg-primary hover:text-primary_light cursor-pointer" role="option" tabindex="-1">{item.name}</a></li>
            {/each}
          </ul>
        </li>
        {/if}        
      </ul>
      {/if}
    </div>
  </div>
</form>