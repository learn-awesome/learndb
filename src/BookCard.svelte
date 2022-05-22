<script>
  export let item;
</script>

<a class="relative flex flex-col w-44 items-center mb-4 rounded-md shadow-lg overflow-hidden transform transition ease-out duration-300 hover:scale-105 hover:shadow-xl" href="#/item/{item.rowid}">
  <img class="object-cover h-64 w-44" src={item.image || '/static/book-cover.png'} alt="{item.name}"/>
  <h1 class="text-lg font-semibold p-2 text-white tracking-wider">
    <sl-rating readonly precision="0.1" value={item.rating}></sl-rating>
  </h1>
  {#if !item.image}
    <div class="absolute inset-y-0 px-2 py-4">
      <p class="font-extrabold text-white text-xl">{item.name}</p>
      <p class="text-sm text-white mt-3">{item.creators}</p>
    </div>
  {/if}
</a>