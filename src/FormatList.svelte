<script>
  import { formats } from "./formats.js"
  
</script>

<div class=" mx-auto flex flex-wrap gap-3 justify-center items-center">
  {#each formats as format}
  <a href="#/format/{format.id}" class="w-32 h-28 relative sm:w-64 flex flex-col rounded-lg shadow-md overflow-hidden transform transition ease-out duration-300 hover:scale-105 ">
      <div class="flex-shrink-0">
        <img class="w-32 h-28 object-cover" src={format.image} alt="">
        <div class="absolute inset-0 bg-neutral_Light mix-blend-multiply"></div>
      </div>
      <div class="absolute flex justify-center items-center inset-0">
        <h1 class="text-sm text-center md:text-lg font-semibold p-2 tracking-wider text-lightGradOne">{format.name}</h1>
      </div>
  </a>
  {/each}
</div>