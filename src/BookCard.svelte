<script>
  export let item;
</script>

<a class="relative flex flex-col sm:w-44 items-center mb-4 rounded-md overflow-hidden transform transition ease-out duration-300 hover:bg-lightSecondary2 drop-shadow-lg hover:drop-shadow-2xl hover:scale-105 break-inside-avoid dark:bg-darkSecondaryBg dark:text-darkSecondary2" href="#/item/{item.rowid}">
  <img class="object-cover sm:h-64 sm:w-44" src={item.image || '/static/book-cover.png'} alt="{item.name}"/>
  
  {#if item.rating}
  <h1 class="text-lg font-semibold p-2 text-white tracking-wider">
    <sl-rating readonly precision="0.1" value={item.rating}></sl-rating>
  </h1>
  {/if}
  
  {#if !item.image}
    <div class="absolute inset-y-0 px-2 py-4 break-inside-avoid">
      <p class="font-bold text-sm sm:font-extrabold text-white sm:text-xl">{item.name}</p>
      <p class="text-sm text-white mt-3">{item.creators}</p>
    </div>
  {/if}
</a>