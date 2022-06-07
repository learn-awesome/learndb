<script>
  import { formats } from "./formats.js"
  
</script>

<div class=" mx-auto flex flex-wrap gap-5 justify-center items-center">
  {#each formats as format}
  <a href="#/format/{format.id}" class="w-52 sm:w-64 flex flex-col rounded-lg shadow overflow-hidden transform transition ease-out duration-300 hover:scale-105 ">
      <div class="flex-shrink-0">
        <img class="h-48 w-full object-cover" src={format.image} alt="">
      </div>
      <h1 class="text-lg font-semibold p-2 tracking-wider text-primary">{format.name}</h1>
  </a>
  {/each}
</div>