<script>
  export let item;
  import { randomCover } from '../../utility.js';
</script>

<a
  class="relative flex flex-col items-center rounded-md overflow-hidden transform transition ease-out duration-300 drop-shadow-lg hover:drop-shadow-2xl hover:scale-105 break-inside-avoid"
  href="#/item/{item.rowid}"
>
  <img
    class=" h-36 w-24 md:h-56 md:w-40 shrink-0"
    src={item.image || randomCover(item.iid)}
    alt={item.name}
  />

  {#if item.rating}
    <h1 class="text-sm md:text-lg font-semibold p-2 text-primary_light tracking-wider">
      <sl-rating style="--symbol-size: 0.80 rem;" readonly precision="0.1" value={item.rating} />
    </h1>
  {/if}

  {#if !item.image}
    <div class="absolute inset-y-0 pl-3 pr-2 py-4 break-inside-avoid">
      <p class="font-bold text-xs md:font-extrabold text-primary_light md:text-base">{item.name}</p>
      <p class="text-xs text-primary_light mt-3">{item.creators}</p>
    </div>
  {/if}
</a>
