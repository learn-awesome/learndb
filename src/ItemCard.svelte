<script>
    export let item;
</script>

<a class="flex flex-col mb-8 bg-indigo-700 justify-center overflow-hidden" href="#/item/{item.rowid}">
  <div class="flex justify-center">
    <img class="h-64 max-w-sm object-contain py-2 mb-6 float-left rounded-md transform transition ease-out duration-300 hover:scale-105" 
      src={item.image} alt="{item.name}">
  </div>
    <span class="flex-1 text-base font-semibold text-yellow-400">★ ★ ★ ★ ★</span>
</a>


