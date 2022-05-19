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
  <main class="px-12 py-10">
    <div class="mb-10 flex h-64">
      <!-- book image  -->
      <div>
        <img class="float-left mr-6 mb-6 h-64 w-44 transform rounded-md border border-purple-200 shadow-md transition duration-300 ease-out hover:scale-105 md:shadow-xl" src="{item.image}" alt="" />
      </div>
      <!-- book details  -->
      <div class="ml-6 flex w-full flex-col justify-between">
        
        <!-- title, sub title, author  -->
        <div>
          <section>
            <h1 class="text-2xl">{item.name}</h1>
            <p class="font text-gray-500">Into Several Rmote Regions of the World</p>
            <span class="text-sm">{item.creator}</span>
          </section>
          <!-- ratings and upload buttons -->
          <div class="mt-2 mb-6 flex justify-between">
            <div>
              <span>★★★★★</span>
              <br />
              <span class="text-sm text-gray-500">333 Ratings</span>
            </div>
            <div class="flex items-center justify-center gap-3 text-gray-500">
              <!-- upload svg  -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <!-- verticle dots  -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </div>
          </div>
  
          <hr />
        </div>
  
        <!-- action buttons  -->
        <div class="mt-10 grid grid-cols-3 place-items-center gap-1 text-gray-800">
          <button class="w-full rounded-md border border-gray-300 py-0.5 text-sm shadow">Get</button>
          <button class="flex w-full items-center justify-center gap-1 rounded-md border border-gray-300 py-0.5 text-sm shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Want to Read
          </button>
          <button class="flex w-full items-center justify-center gap-1 rounded-md border border-gray-300 py-0.5 text-sm shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Sample
          </button>
        </div>
      </div>
    </div>
    <hr />
    <!-- Description  -->
    <section class="my-8">
      <h2 class="text-base font-bold">Description</h2>
      <p class="mt-4 text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non asperiores vel sint veniam placeat tenetur illum cum voluptatum ducimus aut assumenda nesciunt eum veritatis, fuga ex earum. Consectetur, tempore fugit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, veniam voluptates explicabo distinctio accusantium eos a commodi aperiam sit neque non corporis iure odit quisquam laboriosam eum quos iusto nesciunt.</p>
    </section>
    <hr />
    <!-- details  -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x-2 py-5">
      <div class="flex flex-col justify-between items-center gap-1">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">genre</h3>
          <!-- book svg  -->
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
        </div>
        <span class="text-xs">Fiction</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">released</h3>
          <span>1729</span>
        </div>
        <span class="text-xs">December 31</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">language</h3>
          <span>EN</span>
        </div>
        <span class="text-xs">English</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">Length</h3>
          <span>209</span>
        </div>
        <span class="text-xs">Pages</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1">
        <h3 class="uppercase text-xs text-gray-400">Publisher</h3>
        <span></span>
        <br />
        <span class="text-xs">Public Domain</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">Size</h3>
          <span>310.4</span>
        </div>
        <span class="text-xs">KB</span>
      </div>

    </div>
    <hr />
    <!-- Customer review  -->
    <section class="my-8">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-bold">Customer Reviews</h2>
        <button class="text-xs">See All</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 mt-3 gap-2">
        <article class="px-3 py-4 bg-gray-200 rounded-lg text-xs">
          <h3 class="font-semibold">About the book</h3>
          <p class="mt-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.</p>
          <div>
            <span>★★★★★</span>
            <span class="ml-2">Sep 22, 2021</span>
            <span class="ml-2">Priyanka Trivedi</span>
          </div>
        </article>
  
        <article class="px-3 py-4 bg-gray-200 rounded-lg text-xs">
          <h3 class="font-semibold">About the book</h3>
          <p class="mt-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.</p>
          <div>
            <span>★★★★★</span>
            <span class="ml-2">Sep 22, 2021</span>
            <span class="ml-2">Priyanka Trivedi</span>
          </div>
        </article>
      </div>
    </section>
    <hr />
    <!-- more books by same author  -->
    <section class="my-8 overflow-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-bold">More Books by Priyanka Trivedi</h2>
        <button class="float-right text-xs hover:underline">See All</button>
      </div>
      <div class="flex pb-5 mt-3 gap-2 w-full overflow-x-scroll">
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
      </div>  
    </section>
    <hr />
    <!-- Also bought  -->
    <section class="my-8 overflow-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-bold">Other items on the same topics</h2>
        <button class="text-xs hover:underline">See All</button>
      </div>
        
        <div class="flex pb-5 mt-3 gap-2 w-full overflow-x-scroll">
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-32 transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
      </div>
    </section>
  </main>
{:else}
	<p class="loading">loading...</p>
{/if}
