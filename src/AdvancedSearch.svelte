<script>
  let query = '';
  let results = [];

  $: query && fetch(`/learn/items.json?_shape=array&name__contains=${query}`)
        .then(r => r.json())
        .then(data => {
            results = data;
        });
</script>

<div class="relative">

    <div class="overflow-y-auto p-4 sm:p-6 md:p-20">
      <!--
        Command palette, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
      <div class="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
        <div class="relative">
          <!-- Heroicon name: solid/search -->
          <svg class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input bind:value={query} type="text" class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." role="combobox" aria-expanded="false" aria-controls="options">
        </div>
  
        {#if !query }
        <!-- Default state, show/hide based on command palette state -->
        <div class="border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
          <!-- Heroicon name: outline/globe -->
          <svg class="mx-auto h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-4 font-semibold text-gray-900">Search for items, topics and creators</p>
          <p class="mt-2 text-gray-500">Quickly look for resources by running a global search.</p>
        </div>
        
        {:else if results.length > 0}
  
        <!-- Results, show/hide based on command palette state -->
        <ul class="max-h-80 scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2" id="options" role="listbox">
          <li>
            <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900">Items</h2>
            <ul class="mt-2 text-sm text-gray-800">
              {#each results as item}
              <li><a href="#/item/{item.rowid}" class="block cursor-default select-none px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer" id="option-1" role="option" tabindex="-1">{item.name}</a></li>
              {/each}
            </ul>
          </li>
          <li>
            <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900">Topics</h2>
            <ul class="mt-2 text-sm text-gray-800">
                {#each results as topic}
                <li><a href="#/topic/{topic.name}" class="block cursor-default select-none px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer" id="option-1" role="option" tabindex="-1">{topic.name}</a></li>
                {/each}
            </ul>
          </li>
        </ul>

        {:else}
  
        <!-- Empty state, show/hide based on command palette state -->
        <div class="border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
          <!-- Heroicon name: outline/emoji-sad -->
          <svg class="mx-auto h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-4 font-semibold text-gray-900">No results found</p>
          <p class="mt-2 text-gray-500">We couldn’t find anything with that term. Please try again.</p>
        </div>

        {/if}
      </div>
    </div>
  </div>