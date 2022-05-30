<script>
  import Icon from "./tailwindui/Icon.svelte"
  export let item;
</script>

<a class="flex flex-wrap bg-white p-2 rounded-lg mb-8 justify-between overflow-hidden rounded-lg dark:bg-darkSecondaryBg dark:text-darkSecondary2 border-2 border-lightButton2 break-inside-avoid hover:bg-lightSecondary2 text-gray-900 hover:text-gray-50" href="#/item/{item.rowid}">
  <div class="flex flex-col justify-between">
    <div class="flex flex-col">
      <strong class="font-extrabold">{item.name}</strong>
      <span class="text-sm font-medium">{item.creators}</span>
    </div>
    
    <div class="flex items-center justify-start gap-3 mt-2">
      {#each item.links.split(";") as type}
      <a href={type.split("|")[1]} class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-lightSecondary2 text-lightSecondary1 dark:bg-darkSecondaryBg dark:text-darkSecondary2 border" target="_blank"> {type.split("|")[0]} 
        <span class="ml-0.5 w-4 h-4"><Icon kind="link"/></span>
      </a>
      {/each}
    </div>
  </div>

</a>