<script>
  export let item;
  import { randomCover } from './utility.js'
  
</script>

<a class="relative flex flex-col items-center mb-4 rounded-md overflow-hidden transform transition ease-out duration-300 drop-shadow-lg hover:drop-shadow-2xl hover:scale-105 break-inside-avoid" href="#/item/{item.rowid}">
  <img class="object-cover h-36 w-24 lg:h-60 lg:w-40" src={item.image || randomCover(item.iid)} alt="{item.name}"/>
  
  {#if item.rating}
  <h1 class="text-sm md:text-lg font-semibold p-2 text-white tracking-wider">
    <sl-rating style="--symbol-size: 0.80 rem;" readonly precision="0.1" value={item.rating}></sl-rating>
  </h1>
  {/if}
  
  {#if !item.image}
    <div class="absolute inset-y-0 px-2 py-4 break-inside-avoid">
      <p class="font-bold text-xs lg:font-extrabold text-primary_light lg:text-xl">{item.name}</p>
      <p class="text-xs text-primary_light mt-3">{item.creators}</p>
    </div>
  {/if}
</a>