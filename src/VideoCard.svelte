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
  
  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  function get_thumbnail_image_url(item){
    let youtubeformat = item.links.split(";").find(s => s.startsWith('video|') && (s.includes('youtube.com') || s.includes('youtu.be')));
    let youtubeurl = youtubeformat && youtubeformat.split('|')[1];
    let ytid = youtubeurl && youtube_parser(youtubeurl);
    let thumbnail_image_url  = ytid && `https://img.youtube.com/vi/${ytid}/mqdefault.jpg`
    return thumbnail_image_url
  }

</script>


<a class="flex flex-wrap justify-between overflow-hidden rounded-lg duration-300 break-inside-avoid max-w-lg bg-lightPrimCont text-lightPrimary dark:bg-darkPrimCont dark:text-darkPrimary hover:bg-lightPrimary hover:bg-darkPrimary" href="#/item/{item.rowid}">
  <div class="relative w-full max-w-sm w-64 ring-black/5 rounded-xl flex flex-col items-start">
    <div class="h-32 w-64 flex justify-center items-center relative bg-lightSecondary">

      {#if item.image || oEmded_image_ytb_url}
    
      <div>
        <img src={item.image || oEmded_image_ytb_url} class="object-cover " alt="{item.name}">
        <div class="absolute inset-0 w-full h-full flex items-center justify-center" aria-hidden="true">
          <svg class="h-12 w-12 text-indigo-500" fill="currentColor" viewBox="0 0 84 84"><circle opacity="0.9" cx="42" cy="42" r="42" fill="white"></circle><path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z"></path></svg>
        </div>
        
      </div>
      
      {:else}
      
      <div class="absolute inset-0 w-full h-full flex items-center justify-center" aria-hidden="true">
        <svg class="h-12 w-12 text-indigo-500" fill="currentColor" viewBox="0 0 84 84"><circle opacity="0.9" cx="42" cy="42" r="42" fill="white"></circle><path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z"></path></svg>
      </div>
      
      {/if}
    </div>
    
    <div class="flex flex-col ml-5 mt-10 mb-5">
      <strong class="font-extrabold">{item.name}</strong>
      <span class="text-sm font-medium">{item.creators}</span>
    </div>

  </div>
</a> 

