<script>
    import ButtonGroup from "./ButtonGroup.svelte";
    import { bookmarks } from "./stores.js"
    import Icon from "./tailwindui/Icon.svelte"
    import Review from "./Review.svelte"
    
    export let itemid;
    let item;
    let reviews = [];

    $: fetch(`/learn/items/${itemid}.json?_shape=object`)
        .then(r => r.json())
        .then(data => {
            item = data[itemid];
        });
    
    $: item && fetch(`/learn/reviews.json?_shape=array&item_id__exact=${item.iid}`)
      .then(r => r.json())
      .then(data => {
          reviews = data;
    });

    function saveStatusToLocalStorage(event){
      // console.log($bookmarks)
      let newobj = {};
      newobj = Object.assign(newobj, $bookmarks)
      newobj[itemid] = event.detail.value
      // console.log({newobj})
      bookmarks.set(newobj)
    }

    let oEmded_image_ytb_url = null;

  function oEmded_image(item){
      let youtubeformat = item.links.split(";").find(s => s.startsWith('video|') && (s.includes('youtube.com') || s.includes('youtu.be')));
      let youtubeurl = youtubeformat && youtubeformat.split('|')[1];

      if(!youtubeurl) return;

      return `https://www.youtube.com/oembed?url=${youtubeurl}&format=json`
    }
  
  $: item && item.links.includes('video|') && oEmded_image(item) && fetch(oEmded_image(item))
    .then( r => r.json())
    .then(data => {
      oEmded_image_ytb_url = data.thumbnail_url    
    });

    

  //   function youtube_parser(url){
  //   var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  //   var match = url.match(regExp);
  //   return (match&&match[7].length==11)? match[7] : false;
  // }

  // function get_thumbnail_image_url(item){
  //   let youtubeformat = item.links.split(";").find(s => s.startsWith('video|') && (s.includes('youtube.com') || s.includes('youtu.be')));
  //   let youtubeurl = youtubeformat && youtubeformat.split('|')[1];
  //   let ytid = youtubeurl && youtube_parser(youtubeurl);
  //   let thumbnail_image_url  = ytid && `https://img.youtube.com/vi/${ytid}/mqdefault.jpg`
  //   return thumbnail_image_url
  // }

</script>

<style>
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
  
  <div class="max-w-4xl mx-auto border shadow-2xl px-20 py-8 rounded-xl mt-20 bg-white font-sans">
    <h3 class="my-2">
      {#each item.topics.split(";") as topicname}
      <a href={"#/topic/" + topicname} class="mr-2 font-bold">{topicname.toUpperCase()}</a>
      {/each}
    </h3>
    <div class="mt-10">
      <div class="mb-10 flex flex-col sm:flex-row md:flex-col lg:flex-row">
        <div class="flex-nowrap">

          {#if item.image}
          <div class="mr-10">
            <img class="mr-28 mb-6 w-44 h-64 transform rounded-md shadow-lg transition duration-300 ease-out hover:scale-105 md:shadow-xl " src="{item.image}" alt="{item.name}" />
          </div>
  
          <!-- {:else if item.links.includes('book')}
            <img class="mr-6 mb-6 w-44 h-64 transform rounded-md shadow-md transition duration-300 ease-out hover:scale-105 md:shadow-xl" src="/static/book-cover.png" alt="{item.name}" /> -->
  
          {:else if item.links.includes('video') }
            <div class="relative mr-5 rounded-lg overflow-hidden shadow-lg">
              <div class="w-80 h-60 bg-lightPrimary">
                <img class="h-auto w-80 flex justify-center items-center border-r border-gray-500 relative" src="{oEmded_image_ytb_url}" alt="{item.name}">
              </div>
              <div class="absolute inset-0 w-full h-full flex items-center justify-center" aria-hidden="true">
                <svg class="h-12 w-12 text-indigo-500" fill="currentColor" viewBox="0 0 84 84"><circle opacity="0.9" cx="42" cy="42" r="42" fill="white"></circle><path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z"></path></svg>
              </div>
            </div>
  
          {:else if !item.links.includes('video') && item.links.includes('book')}
          <div class="mr-10 shadow-lg">
            <img class="mr-28 mb-6 w-44 h-64 transform rounded-md shadow-md transition duration-300 ease-out hover:scale-105 md:shadow-xl" src="/static/book-cover.png" alt="{item.name}" />
          </div>
          {/if}
          <!-- <img class="mr-6 mb-6 w-44 h-64 transform rounded-md shadow-md transition duration-300 ease-out hover:scale-105 md:shadow-xl" src="{item.image || '/static/book-cover.png'}" alt="" /> -->
        </div>
        <!-- book details  -->
        <div class="flex w-full flex-col justify-between">
          <!-- title, sub title, author  -->
          <section>
            <h1 class="text-4xl">{item.name}</h1>
            <span class="text-sm mt-5">{item.creators}</span>
            <div class="mt-5">
              <sl-rating readonly precision="0.1" value={item.rating}></sl-rating>
            </div>
          </section>
          <!-- ratings and upload buttons -->
          <div class="mt-2 mb-6 flex flex-col justify-between">
            <div class="flex items-center justify-start gap-3 mt-5">
              {#each item.links.split(";") as type}
              <a href={type.split("|")[1]} class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-lightPrimary border drop-shadow-lg hover:scale-x-105" title='Visit the original link' target="_blank"> {type.split("|")[0]} 
                <span class="ml-0.5 h-4 w-4"><Icon kind="link"/></span>
              </a>
              {/each}
            </div>
            <ButtonGroup tabs={['Want to learn','Finished']} currentlySelected={$bookmarks[itemid]} on:change={saveStatusToLocalStorage}/>    
          </div>
        </div>
      </div>
      <hr class="bg-lightPrimary"/>
      
      <!-- Description  -->
      {#if item.description}
      <section class="my-8">
        <h2 class="font-bold text-lg">Description</h2>
        <p class="mt-4 tracking-wide">{item.description}</p>
      </section>
      {/if}

      
      <!-- details  -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        
        {#if item.genre}
          
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
          <span class="text-xs ">{item.genre}</span>
        </div>
        {/if}
  
        {#if item.year}
        <div class="flex flex-col justify-between items-center gap-1 border py-5 border-gray-200">
          <div class="flex flex-col items-center">
            <h3 class="uppercase text-xs ">year</h3>
            <span>{item.year}</span>
          </div>
        </div>
        {/if}
  
        {#if item.difficulty}
        <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
          <div class="flex flex-col items-center">
            <h3 class="uppercase text-xs ">Difficulty</h3>
            <span></span>
          </div>
          <span class="text-xs">{item.difficulty}</span>
        </div>
        {/if}
  
        {#if item.creators}
        <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
          <div class="flex flex-col items-center">
            <h3 class="uppercase text-xs ">Creator</h3>
            <span></span>
          </div>
          <span class="text-xs">{item.creators}</span>
        </div>
        {/if}
  
        <!-- {#if }
        <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
          <h3 class="uppercase text-xs ">Publisher</h3>
          <span></span>
          <br />
          <span class="text-xs">Public Domain</span>
        </div>
        {/if} -->
  
        {#if item.size}
        <div class="flex flex-col justify-between items-center gap-1 border border-gray-200 py-5">
          <div class="flex flex-col items-center">
            <h3 class="uppercase text-xs text-gray-400">Size</h3>
            <span></span>
          </div>
          <span class="text-xs">{item.size}</span>
        </div>
        {/if}
      </div>
      
      <!-- review  -->
      {#if reviews.length > 0}
      <section class="my-8">
        <div class="flex justify-between items-center">
          <h2 class="text-base font-bold">Reviews</h2>
        </div>
        
        <div class="flex flex-col md:flex-row md:overflow-x-auto md:pb-5 mt-3 gap-2 scroll">
        {#each reviews as review}
          <Review {review}/>
        {/each}
    
        </div>
      </section>
      {/if}
    </div>
  </div> 
{:else}
	<p class="loading">loading...</p>
{/if}
