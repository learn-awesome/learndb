<script>
    export let itemid;

    let item;

    $: fetch(`/learn/items/${itemid}.json?_shape=object`)
        .then(r => r.json())
        .then(data => {
            item = data[itemid];
        });

</script>

{#if item}

<main class="bg-white max-w-2xl shadow rounded-md">

    <article class="px-4 py-4">
    
      <div class="mb-4 text-sm text-gray-900">    
          <span class="text-base font-semibold text-yellow-400">★ ★ ★ ★ ★</span>
          <a href="#/topic/{item.topics}" class="flex-shrink-0 px-1 py-0.5 text-gray-500 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 hover:text-black font-semibold">{item.topics}</a>
      </div>
    
    

      <h1 class="inline text-xl md:text-2xl font-bold ">{item.name}</h1>

      <img class="h-64 w-44 mr-6 mb-6 float-left border border-purple-200 rounded-md shadow-md md:shadow-xl transform transition ease-out duration-300 hover:scale-105" 
      src={item.image} alt="">

      <p>{item.description}</p>
    
      <div class="flex mt-8 border-t border-b border-gray-100 p-2 justify-between rounded-lg">
        <div class="text-center px-2 md:px-6">
          <p class="uppercase text-gray-400 text-xs">difficulty</p>
          <p class="md:text-2xl">childlike</p>
        </div>

        <div class="text-center px-2 md:px-6">
            <p class="uppercase text-gray-400 text-xs">year</p>
            <p class="md:text-2xl">2013</p>
          </div>

          <div class="text-center px-2 md:px-6">
            <p class="uppercase text-gray-400 text-xs">cost</p>
            <p class="md:text-2xl">Free</p>
          </div>
      </div>

      <p class="mt-4">
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-gray-800"> Book </span>
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800"> Video </span>
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-red-800"> Course </span>
      </p>
    
    
    </article>
    
    
    </main>

{:else}
	<p class="loading">loading...</p>
{/if}
