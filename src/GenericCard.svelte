<script lang="ts">
  export let item: {name: string, creators: string};
</script>

<a class="flex flex-wrap p-2 sm:p-8 justify-between rounded-lg break-inside-avoid sm:w-64 max-w-sm bg-lightPrimCont text-lightPrimary dark:bg-darkPrimCont dark:text-darkPrimary hover:bg-lightPrimary hover:bg-darkPrimary" href="#/item/{item.rowid}">
  <div class="flex flex-col justify-between">
    <div class="flex flex-col">
      <strong class="font-extrabold text-sm sm:text-lg">{item.name}</strong>
      <span class="text-sm font-medium">{item.creators}</span>
    </div>
  </div>
</a>
