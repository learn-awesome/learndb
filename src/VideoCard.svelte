<script>
  export let item;
  let youtubeformat = item.links.split(";").find(s => s.startsWith('video|') && (s.includes('youtube.com') || s.includes('youtu.be')));
  let youtubeurl = youtubeformat && youtubeformat.split('|')[1];

  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  let ytid = youtubeurl && youtube_parser(youtubeurl);
  let thumbnail_image_url  = ytid && `https://img.youtube.com/vi/${ytid}/mqdefault.jpg`

  let vimeo = GET https://vimeo.com/api/oembed.json?url={video_url}
</script>


<a class="flex flex-wrap w-full mb-8 justify-between overflow-hidden text-gray-50 rounded-lg border border-gray-500 hover:scale-105 duration-300" href="#/item/{item.rowid}">
  <div class="relative w-full h-28 max-w-sm shadow-lg ring-1 ring-black/5 rounded-xl flex items-start">
    <div class="h-28 w-44 flex justify-center items-center border-r border-gray-500 relative">

      {#if item.image || thumbnail_image_url}
      
      <div>
        <img src={item.image || thumbnail_image_url} class="h-28 object-cover" alt="{item.name}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="absolute top-1/3 left-1/3 z-20 h-10 w-10 fill-gray-500"><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>
      </div>
      
      {:else}
      
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="h-10 w-10 fill-gray-500"><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>
      
      {/if}
    </div>
    
    <div class="flex flex-col ml-5 w-2/3 mt-2">
      <strong class="text-white font-extrabold">{item.name}</strong>
      <span class="text-white text-sm font-medium">{item.creators}</span>
    </div>
  </div>
</a> 

