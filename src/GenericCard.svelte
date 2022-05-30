<script>
  import Icon from "./tailwindui/Icon.svelte"
  export let item;
</script>

<a class="flex flex-wrap p-2 justify-between rounded-lg break-inside-avoid w-64 max-w-sm bg-lightPrimCont text-lightPrimary dark:bg-darkPrimCont dark:text-darkPrimary hover:bg-lightPrimary hover:bg-darkPrimary" href="#/item/{item.rowid}">
  <div class="flex flex-col justify-between">
    <div class="flex flex-col">
      <strong class="font-extrabold">{item.name}</strong>
      <span class="text-sm font-medium">{item.creators}</span>
    </div>
    
    <div class="flex flex-wrap items-center justify-start gap-3 mt-2">
      {#each item.links.split(";") as type}
      <a href={type.split("|")[1]} class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-lightTertiary dark:bg-darkTertiary text-lightBg dark:text-darkBg border" target="_blank"> {type.split("|")[0]} 
        <span class="ml-0.5 w-4 h-4"><Icon kind="link"/></span>
      </a>
      {/each}
    </div>
  </div>
</a>
