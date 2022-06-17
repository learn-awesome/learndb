<script>
    import ButtonGroup from "./ButtonGroup.svelte";
    import { bookmarks } from "./stores.js"
    import Review from "./Review.svelte"
    import { randomCover } from './utility.js'
import AdvancedSearch from "./AdvancedSearch.svelte";
    
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

    function get_tld(url){
      return(new URL(url)).hostname.replace('www.','');
    }

    function saveStatusToLocalStorage(event){
      // console.log($bookmarks)
      let newobj = {};
      newobj = Object.assign(newobj, $bookmarks)
      newobj[itemid] = event.detail.value
      // console.log({newobj})
      bookmarks.set(newobj)
    }

    let oEmded_image_ytb_url = null;
    let oembed_iframe = null;

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
      oembed_iframe = data.html 
    });

    
    function wikiUrlForEmbed(item){
      var wikiurl = item.links.split(";").find((l) => l.includes('wiki|')).split('|')[1];
      return wikiurl.replace('simple.wikipedia.org/','simple.m.wikipedia.org/').replace('en.wikipedia.org/','en.m.wikipedia.org/');
    }

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
  .linkButton::part(base){
    max-width: fit-content;
    min-height: fit-content;
  }
</style>

{#if item}
  
  <div class="w-full px-6 py-4 mt-10 lg:max-w-4xl mx-auto border shadow-2xl lg:px-20 lg:py-8 rounded-xl lg:mt-20 bg-primary_light font-sans">
    <h3 class="my-2">
      {#each item.topics.split(";") as topicname}
      <div class="group inline-flex">
        <a href={"#/topic/" + topicname} class="mr-2 font-bold">{topicname.toUpperCase()}
          <div class="w-5 mt-0.25 h-0.5 ml-1 bg-primary group-hover:w-full ease-in-out duration-300"></div>
        </a>
      </div>
      {/each}
    </h3>

    <div class="mt-10">
        <div class="mb-10 flex flex-wrap  justify-start">
          <div class={((item.links.includes('video|') && oembed_iframe) || (item.links.includes('wiki|')) ? 'w-full' : '')}>
            {#if item.links.includes('wiki|')}
              <iframe src={wikiUrlForEmbed(item)} class="w-full h-[48rem]" title="embedded wiki"></iframe>
            {:else if item.links.includes('video|') && oembed_iframe}
              {@html oembed_iframe.replace('width="200"','width="100%"').replace(/height=["'][0-9]+["']/i,'height="400"')}
            {:else if item.image}
              <div class="">
                <img class="mr-5 mb-6 sm:w-44 sm:h-64 transform rounded-md shadow-lg transition duration-300 ease-out hover:scale-105 md:shadow-xl " src="{item.image}" alt="{item.name}" />
              </div>
            {:else if item.links.includes('video') }
              <div class="relative mr-5 rounded-lg overflow-hidden shadow-lg">
                <div class="w-80 h-60">
                  <img class="h-auto w-80 flex justify-center items-center border-r border-gray-500 relative" src="{oEmded_image_ytb_url}" alt="{item.name}">
                </div>
                <div class="absolute inset-0 w-full h-full flex items-center justify-center" aria-hidden="true">
                  <svg class="h-12 w-12 text-indigo-500" fill="currentColor" viewBox="0 0 84 84"><circle opacity="0.9" cx="42" cy="42" r="42" fill="white"></circle><path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z"></path></svg>
                </div>
              </div>
            {:else if !item.links.includes('video') && item.links.includes('book')}
            <div class="sm:mr-10 w-44 h-64 relative">
              <img class="w-44 h-64 mr-28 mb-6 h-auto transform rounded-md shadow-md transition duration-300 ease-out hover:scale-105 md:shadow-xl" src={randomCover(item.iid)} alt="{item.name}" />

              <div class="absolute inset-y-0 pl-4 pr-6 py-4 break-inside-avoid">
                <p class="font-bold text-white text-2xl">{item.name}</p>
                <p class="text-sm text-white mt-3">{item.creators}</p>
              </div>
    
            </div>
            {/if}

          </div>

          <!-- item details  -->
          <div class={(item.image ? 'lg:mt-0' : '') + " mt-10 w-full flex flex-col justify-between flex-1"}>
            <!-- title, sub title, author  -->
            <section>
              <h1 class="text-xl md:text-4xl font-extrabold">{item.name}</h1>
              <span class="text-sm mt-5">{item.creators}</span>
              <div class="mt-5">
                <sl-rating readonly precision="0.1" value={item.rating}></sl-rating>
              </div>
            </section>
            <!-- ratings and upload buttons -->
            <div class="mt-2 mb-6 flex flex-col justify-between">
              <div class="flex flex-wrap items-center justify-start gap-3 mt-5">
                {#each item.links.split(";") as type}
                <sl-button-group>
                  <sl-button size="small" href={type.split("|")[1]} target="_blank" class="linkButton">{type.split("|")[0]} at {get_tld(type.split("|")[1])} <sl-icon name="link-45deg"></sl-icon></sl-button>
                  {#if type.split("|")[2] || type.split("|")[0] === 'book'}
                    <sl-dropdown placement="bottom-end" on:sl-select="{e => window.open(e.detail.item.value, '_blank')}">
                      <sl-button slot="trigger" size="small" caret>
                        <sl-icon name="cloud-download"></sl-icon>
                      </sl-button>
                      <sl-menu style="width: 200px;">
                        {#if type.split("|")[2] && type.split("|")[2].startsWith('ipfs:')}
                        <sl-menu-label>Download via IPFS:</sl-menu-label>
                        <sl-menu-item value={'https://cloudflare-ipfs.com/ipfs/' + type.split("|")[2].replace('ipfs:','')}>Cloudflare</sl-menu-item>
                        <sl-menu-item value={'https://ipfs.io/ipfs/' + type.split("|")[2].replace('ipfs:','')}>IPFS.io</sl-menu-item>
                        <sl-menu-item value={'https://ipfs.infura.io/ipfs/' + type.split("|")[2].replace('ipfs:','')}>Infura</sl-menu-item>
                        <sl-menu-item value={'https://gateway.pinata.cloud/ipfs/' + type.split("|")[2].replace('ipfs:','')}>Pinata</sl-menu-item>
                        {/if}

                        {#if type.split("|")[2] && type.split("|")[2].startsWith('doi:')}
                        <sl-menu-item value={'https://sci-hub.se/' + type.split("|")[2].replace('doi:','')}>On SciHub</sl-menu-item>
                        {/if}
                        
                        {#if type.split("|")[0] === 'book'}
                        <sl-divider></sl-divider>
                        <sl-menu-label>Look up on:</sl-menu-label>
                        <sl-menu-item value={'http://libgen.rs/search.php?req=' + encodeURIComponent(item.name)}>LibGen</sl-menu-item>
                        <sl-menu-item value={'https://openlibrary.org/search?q=' + encodeURIComponent(item.name)}>OpenLibrary</sl-menu-item>
                        <sl-menu-item value={'https://www.goodreads.com/search?q=' + encodeURIComponent(item.name)}>GoodReads</sl-menu-item>
                        {/if}
                      </sl-menu>
                    </sl-dropdown>
                  {/if}
                </sl-button-group>
                {/each}
              </div>
              <ButtonGroup tabs={['Want to learn','Finished']} currentlySelected={$bookmarks[itemid]} on:change={saveStatusToLocalStorage}/>    
            </div>
          </div>
        </div>
        

        <!-- Description  -->
        {#if item.description}
        <hr class="bg-neutral_light"/>
        <section class="my-8">
          <h2 class="font-bold text-lg">Description</h2>
          <p class="mt-4 tracking-wide">{item.description}</p>
        </section>
        {/if}
       
      <!-- item fields  -->
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
        <div class="flex flex-col justify-between items-center gap-1 border border-neutral_dark py-5 px-2">
          <div class="flex flex-col items-center">
            <h3 class="uppercase text-xs ">Creator</h3>
            <span></span>
          </div>
          <span class="text-xs text-center font-bold">{item.creators}</span>
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
      
      <!-- reviews  -->
      {#if reviews.length > 0}
      <section class="my-8">
        <div class="flex justify-between items-center">
          <h2 class="text-base font-bold">Reviews</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 md:overflow-x-auto md:pb-5 mt-3 gap-3 scroll">
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
