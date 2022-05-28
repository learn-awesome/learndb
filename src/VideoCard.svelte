<script>
  export let item;
  
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


<a class="flex flex-wrap w-full mb-8 justify-between overflow-hidden rounded-lg bg-lightSecondary1 border-2 border-lightButton2 hover:scale-105 duration-300" href="#/item/{item.rowid}">
  <div class="relative w-full h-28 max-w-sm shadow-lg ring-1 ring-black/5 rounded-xl flex items-start">
    <div class="h-28 w-44 flex justify-center items-center border-r border-gray-500 relative">

      {#if item.image || get_thumbnail_image_url(item)}
    
      <div>
        <img src={item.image || get_thumbnail_image_url(item)} class="h-28 object-cover" alt="{item.name}">
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
    
    <div class="flex flex-col ml-5 w-2/3 mt-2">
      <strong class="text-lightPrimaryText font-extrabold">{item.name}</strong>
      <span class="text-lightSecondary2 text-sm font-medium">{item.creators}</span>
    </div>
  </div>
</a> 

