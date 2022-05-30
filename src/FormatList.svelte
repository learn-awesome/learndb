<script>
  import { formats } from "./formats.js"
  
</script>

<h1 class="my-10">Learn from the following formats</h1>
<div class=" mx-auto flex flex-wrap gap-5 justify-center items-center">
  {#each formats as format}
  <a href="#/format/{format.id}" class="w-64 flex flex-col rounded-lg shadow-md overflow-hidden transform transition ease-out duration-300 hover:scale-105 bg-lightPrimCont text-lightPrimary dark:bg-darkPrimCont dark:text-darkPrimary">
      <div class="flex-shrink-0">
        <img class="h-48 w-full object-cover" src={format.image} alt="">
      </div>
      <h1 class="text-lg font-semibold p-2 tracking-wider ">{format.name}</h1>
  </a>
  {/each}
</div>