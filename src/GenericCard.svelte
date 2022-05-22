<script>
  export let item;
</script>

<a class="flex flex-wrap w-80 bg-white p-2 rounded-lg mb-8 justify-between overflow-hidden text-gray-50 rounded-lg" href="#/item/{item.rowid}">
<div class="flex flex-col">
  <strong class="text-gray-900 text-lg font-extrabold">{item.name}</strong>
  <span class="text-gray-900 text-sm font-medium">{item.creators}</span>
</div>
</a>