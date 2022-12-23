<script>
  // import ButtonGroup from "./ButtonGroup.svelte";
  // import { oEmdedProviders } from "./oEmbedProviders.js"
  export let item;
  let oEmded_image_ytb_url = null;

  function oEmded_image(item){
    let youtubeformat = item.links.split(";").find(s => s.startsWith('video|') && (s.includes('youtube.com') || s.includes('youtu.be')));
    let youtubeurl = youtubeformat && youtubeformat.split('|')[1];

    if(!youtubeurl) return;

    return `https://www.youtube.com/oembed?url=${youtubeurl}&format=json`
  }
  
  $: oEmded_image(item) && fetch(oEmded_image(item))
    .then( r => r.json())
    .then(data => {
      oEmded_image_ytb_url = data.thumbnail_url    
    });

</script>


<a class="flex flex-wrap overflow-hidden rounded-lg duration-300 break-inside-avoid max-w-lg border-secondary" href="#/item/{item.iid}">
  <div class="relative w-full max-w-sm w-full md:w-64 ring-black/5 rounded-xl flex flex-col items-center">
    <div class="h-36 w-full md:w-64 flex justify-center items-center relative ">

      {#if item.image || oEmded_image_ytb_url}
    
      <div class="rounded-md overflow-hidden">
        <img src={item.image || oEmded_image_ytb_url} class="object-contain w-48 h-36" alt="{item.name}">
        <div class="absolute inset-0 w-full h-full flex items-center justify-center" aria-hidden="true">
          <svg class="h-12 w-12 text-indigo-500" fill="currentColor" viewBox="0 0 84 84"><circle opacity="0.9" cx="42" cy="42" r="42" fill="white"></circle><path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z"></path></svg>
        </div>
        
      </div>
      
      {:else}
      
      <div class="w-full flex justify-center items-center rounded-lg">
        <div class="w-48 h-36 bg-primary rounded-md"></div>
        <div class="absolute inset-0 w-full h-full flex items-center justify-center" aria-hidden="true">
          <svg class="h-12 w-12 text-indigo-500" fill="currentColor" viewBox="0 0 84 84"><circle opacity="0.9" cx="42" cy="42" r="42" fill="white"></circle><path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z"></path></svg>
        </div>
      </div>
      
      
      {/if}
    </div>
    
    <div class="flex flex-col my-5 w-48">
      <strong class="font-extrabold">{item.name}</strong>
      {#if item.creators}<span class="text-sm font-medium">{item.creators}</span>{/if}
    </div>

  </div>
</a> 

