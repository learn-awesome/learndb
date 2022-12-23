<script>
  export let item;
</script>

<a class="flex flex-wrap p-2 sm:p-8 justify-between rounded break-inside-avoid sm:w-64 max-w-sm bg-primary_light text-primary hover:rounded-3xl border border-secondary ease-in-out duration-300" href="#/item/{item.iid}">
  <div class="flex flex-col justify-between">
    <div class="flex flex-col">
      <strong class="font-extrabold text-sm sm:text-lg">{item.name}</strong>
      {#if item.creators}<span class="text-sm font-medium">{item.creators}</span>{/if}
    </div>
  </div>
</a>
