<script>
  import { formats } from "./formats.js"
  
</script>

<h1 class="my-10 text-lightButton2 dark:text-darkButton2">Learn from the following formats</h1>
<div class="max-w-lg mx-auto grid grid-cols-2 gap-5 lg:grid-cols-3 lg:max-w-none">
  {#each formats as format}
  <a href="#/format/{format.id}" class="flex flex-col rounded-lg shadow-lg overflow-hidden transform transition ease-out duration-300 hover:scale-105 hover:shadow-xl">
      <div class="flex-shrink-0">
        <img class="h-48 w-full object-cover" src={format.image} alt="">
      </div>
      <h1 class="text-lg font-semibold p-2 bg-lightButton2 text-lightButton1 tracking-wider">{format.name}</h1>
  </a>
  {/each}
</div>