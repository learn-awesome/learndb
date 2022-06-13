<script>
  import { formats } from "./formats.js"
  
</script>

<div class=" mx-auto grid pl-items-center gap-3 sm:grid-cols-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 min-h-screen">
  {#each formats as format}
  <a href="#/format/{format.id}" class="w-32 h-28 lg:w-44 relative flex flex-col rounded-lg shadow-md overflow-hidden transform transition ease-out duration-300 hover:scale-105 ">
      <div class="flex-shrink-0 relative">
        <img class="w-32 h-28 lg:w-48 object-cover" src={format.image} alt="">
        <h1 class="absolute inset-x-0 bottom-0 text-sm text-center md:text-sm font-semibold py-1 tracking-wider text-primary_light bg-primary bg-opacity-90">{format.name}</h1>
      </div>
      
  </a>
  {/each}
</div>