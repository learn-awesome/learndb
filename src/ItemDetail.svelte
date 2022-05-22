<script>
    import ButtonGroup from "./ButtonGroup.svelte";
    import { bookmarks } from "./stores.js"
    import Icon from "./tailwindui/Icon.svelte"

    export let itemid;
    let item;

    $: fetch(`/learn/items/${itemid}.json?_shape=object`)
        .then(r => r.json())
        .then(data => {
            item = data[itemid];
        });

    function saveStatusToLocalStorage(event){
      // console.log($bookmarks)
      let newobj = {};
      newobj = Object.assign(newobj, $bookmarks)
      newobj[itemid] = event.detail.value
      // console.log({newobj})
      bookmarks.set(newobj)
    }

    let reviews =[
      {
        heading: "About the book , My favourite book ever, everyone should read it before the death or else it will be difficult to hold it in hands",
        details: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit architecto praesentium expedita? Similique dolor iusto expedita enim, optio dignissimos eaque officiis perferendis eum ullam voluptas esse quia tenetur natus modi.",
        ratings: 5,
        by: "lorem ipsum",
        date: "Sep 22, 2021",
        image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
      },
      {
        heading: "Highly recommended book",
        details: "Lorem ipsum",
        ratings: 4,
        by: "anka",
        date: "Sep 22, 2081",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
      },
      {
        heading: "Nice Book",
        details: "iusto expedita enim, optio dignissimos eaque officiis perferendis eum",
        ratings: 3,
        by: "lorem",
        date: "Sep 22, 2027",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
      }
    ];

</script>

<style>
  .line-clamp{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .scroll{
    scrollbar-width: thin;
    scrollbar-color: rgb(31 41 55);
    scrollbar-gutter: stable;
  }
  .scroll::-webkit-scrollbar{
    width:10px
  }
  .scroll::-webkit-scrollbar-track{
    background-color: rgb(55 65 81);
  }
  .scroll::-webkit-scrollbar-thumb {
    background-color: rgb(31 41 55);
}
</style>

{#if item}
  <main class="px-12 py-10">
    <h3 class="py-2 mb-5">
      {#each item.topics.split(";") as topicname}
      <a href={"#/topic/" + topicname} class="mr-2 font-bold text-cyan-400">{topicname}</a>
      {/each}
    </h3>
    <div class="mb-10 flex flex-col sm:flex-row md:flex-col lg:flex-row">
      <!-- book image  -->
      <div class="flex-nowrap">
        <img class="mr-6 mb-6 w-44 h-64 transform rounded-md shadow-md transition duration-300 ease-out hover:scale-105 md:shadow-xl" src="{item.image || '/static/book-cover.png'}" alt="" />
      </div>
      <!-- book details  -->
      <div class="flex w-full flex-col justify-between ml-5">
        <!-- title, sub title, author  -->
        <section>
          <h1 class="text-2xl text-white">{item.name}</h1>
          <p class="font text-gray-400">{item.description}</p>
          <span class="text-sm">{item.creators}</span>
        </section>
        <!-- ratings and upload buttons -->
        <div class="mt-2 mb-6 flex flex-col justify-between">
          <div class="flex justify-between items-center">
            <div>
              <sl-rating readonly precision="0.1" value={item.rating}></sl-rating>
            </div>
            
            <ButtonGroup tabs={['Want to learn','Finished']} currentlySelected={$bookmarks[itemid]} on:change={saveStatusToLocalStorage}/>

          </div>
          

          <div class="flex items-center justify-start gap-3 text-gray-500 mt-5">
            {#each item.links.split(";") as type}
            <a href={type.split("|")[1]} class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-violet-800 text-gray-50 border" target="_blank"> {type.split("|")[0]} 
              <span class="ml-0.5"><Icon kind="link"/></span>
            </a>
            {/each}
          </div>
        </div>
      </div>
    </div>
    <hr />
    
    <!-- Description  -->
    <section class="my-8">
      <h2 class="text-base font-bold text-gray-100 ">Description</h2>
      <p class="mt-4 text-sm text-gray-200">{item.description}</p>
    </section>
    <hr />
    <!-- details  -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6  text-gray-400">
      <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs">genre</h3>
          <!-- book svg  -->
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
        </div>
        <span class="text-xs ">Fiction</span>
      </div>

      <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
        <div class="flex flex-col items-center">
          <h3 class="uppercase text-xs text-gray-400">year</h3>
          <span>{item.year}</span>
        </div>
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
        <h2 class="text-base font-bold text-gray-100">Reviews</h2>
      </div>
      
      <div class="flex flex-col md:flex-row md:overflow-x-auto md:pb-5 mt-3 gap-2 scroll">
        {#each reviews as review}
          <article class="px-3 pt-4 bg-gray-800 rounded-lg text-sm shrink-0 w-full lg:w-1/2 flex flex-col justify-between h-48">
            <div>
              <h3 class="font-semibold truncate text-gray-50">{review.heading}</h3>
              <p class="mt-2 line-clamp text-gray-200">{review.details}</p>
            </div>
            <div class="mt-4">
              <div class="flex justify-start items-center">
                <img src={review.image} class="rounded-full w-10 h-10" alt="user avatar"/>
                <div class="flex flex-col items-start ml-2 overflow-hidden text-xs text-gray-300">
                  <p class="truncate pr-2">By {review.by}</p>
                  <span class="">{review.date}</span>  
                </div>
              </div>
              <div class="ml-10 mt-1">
                <sl-rating style="--symbol-size: 1rem" readonly precision="0.1" value={review.rating}></sl-rating>
              </div>
              
            </div>
          </article>
        {/each}  
      </div>
    </section>
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
