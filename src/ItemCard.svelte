<script>
    export let item;
</script>

<a class="flex flex-col mb-8" href="#/item/{item.rowid}">
    <img class="h-64 w-44 mr-6 mb-6 float-left border border-purple-200 rounded-md shadow-md md:shadow-xl transform transition ease-out duration-300 hover:scale-105" 
      src={item.image} alt="">
    <div class="flex-1 text-base font-semibold text-yellow-400">★ ★ ★ ★ ★</div>
</a>


