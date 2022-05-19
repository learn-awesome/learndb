<script>
    import WantToLearnButton from './WantToLearnButton.svelte';
    import Button from "./Button.svelte";
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
    <div class="mb-10 flex flex-col sm:flex-row md:flex-col lg:flex-row">
      <!-- book image  -->
      <div class="flex-nowrap">
        <img class=" mr-6 mb-6 transform rounded-md shadow-md transition duration-300 ease-out hover:scale-105 md:shadow-xl" src="{item.image}" alt="" />
      </div>
      <!-- book details  -->
      <div class="sm:ml-6 md:ml-0 lg:ml-6 flex w-full flex-col justify-between">
        <!-- title, sub title, author  -->
        <section>
          <h1 class="text-2xl">{item.name}</h1>
          <p class="font text-gray-500">Into Several Rmote Regions of the World</p>
          <span class="text-sm">{item.creator}</span>
        </section>
        <!-- ratings and upload buttons -->
        <div class="mt-2 mb-6 flex flex-col justify-between">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-yellow-500">★★★★★</span>
              <br />
              <span class="text-xs text-gray-500">333 Ratings</span>
            </div>
            
            <Button />
          </div>
          

          <div class="flex items-center justify-start gap-3 text-gray-500 mt-5">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-400 text-gray-800"> Book </span>

            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400 text-gray-800"> Video </span>
          </div>
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
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
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

      <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">released</h3>
          <span>1729</span>
        </div>
        <span class="text-xs">December 31</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">language</h3>
          <span>EN</span>
        </div>
        <span class="text-xs">English</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">Length</h3>
          <span>209</span>
        </div>
        <span class="text-xs">Pages</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
        <h3 class="uppercase text-xs text-gray-400">Publisher</h3>
        <span></span>
        <br />
        <span class="text-xs">Public Domain</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">Size</h3>
          <span>310.4</span>
        </div>
        <span class="text-xs">KB</span>
      </div>

    </div>
    <hr />
    <!-- review  -->
    <section class="my-8">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-bold">Reviews</h2>
      </div>
      
      <div class="flex flex-col md:flex-row md:overflow-x-auto md:pb-5 mt-3 gap-2">
        <article class="px-3 py-4 bg-gray-200 rounded-lg text-xs w-48 max-w-sm shrink-0">
          <h3 class="font-semibold">About the book</h3>
          <p class="mt-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.</p>
          <div class="mt-3">
            <span>★★★★★</span>
            <span class="ml-2">Sep 22, 2021</span>
            <span class="ml-2">Priyanka Trivedi</span>
          </div>
        </article>
  
        <article class="px-3 py-4 bg-gray-200 rounded-lg text-xs w-48 max-w-sm shrink-0">
          <h3 class="font-semibold">About the book</h3>
          <p class="mt-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.</p>
          <div class="mt-3">
            <span>★★★★★</span>
            <span class="ml-2">Sep 22, 2021</span>
            <span class="ml-2">Priyanka Trivedi</span>
          </div>
        </article>

        <article class="px-3 py-4 bg-gray-200 rounded-lg text-xs w-48 max-w-sm shrink-0">
          <h3 class="font-semibold">About the book</h3>
          <p class="mt-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.</p>
          <div class="mt-3">
            <span>★★★★★</span>
            <span class="ml-2">Sep 22, 2021</span>
            <span class="ml-2">Priyanka Trivedi</span>
          </div>
        </article>

        <article class="px-3 py-4 bg-gray-200 rounded-lg text-xs w-48 max-w-sm shrink-0">
          <h3 class="font-semibold">About the book</h3>
          <p class="mt-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.</p>
          <div class="mt-3">
            <span>★★★★★</span>
            <span class="ml-2">Sep 22, 2021</span>
            <span class="ml-2">Priyanka Trivedi</span>
          </div>
        </article>

        <article class="px-3 py-4 bg-gray-200 rounded-lg text-xs w-48 max-w-sm shrink-0">
          <h3 class="font-semibold">About the book</h3>
          <p class="mt-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.</p>
          <div class="mt-3">
            <span>★★★★★</span>
            <span class="ml-2">Sep 22, 2021</span>
            <span class="ml-2">Priyanka Trivedi</span>
          </div>
        </article>
      </div>
    </section>
    <hr />
    <!-- more books by same author  -->

    <!-- <section class="my-8 overflow-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-bold">More Books by Priyanka Trivedi</h2>
        <button class="float-right text-xs hover:underline">See All</button>
      </div>
      <div class="flex pb-5 mt-3 gap-2 w-full overflow-x-auto">
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          <div class="flex flex-col items-start text-xs gap-1">
            <h4 class="font-semibold">A Modest Proposal</h4>
            <span class="text-gray-500">Priyanka Trivedi</span>
            <button class="border rounded-2xl uppercase px-2 py-0.5 border-black">Get</button>
          </div>
        </div>
      </div>  
    
    </section>
    <hr /> -->

    <!-- Also bought  -->

    <!-- <section class="my-8 overflow-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-base font-bold">Other items on the same topics</h2>
        <button class="text-xs hover:underline">See All</button>
      </div>
        
        <div class="flex pb-5 mt-3 gap-2 w-full overflow-x-scroll">
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
  
        <div class="shrink-0">
          <div class="" >
            <img class="mb-4 h-44 w-auto transform rounded-md border border-purple-200 shadow-md md:shadow-xl" src="{item.image}" alt="" />
          </div>
          
        </div>
      </div>
    </section> -->
  </main>
{:else}
	<p class="loading">loading...</p>
{/if}
