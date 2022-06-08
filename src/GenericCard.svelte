<script lang="ts">
  export let item: {name: string, creators: string, rowid: number};
</script>

<a class="flex flex-wrap p-2 sm:p-8 justify-between rounded break-inside-avoid sm:w-64 max-w-sm bg-white text-primary dark:bg-neutral_dark dark:text-primary_light hover:rounded-3xl border border-secondary ease-in-out duration-300" href="#/item/{item.rowid}">
  <div class="flex flex-col justify-between">
    <div class="flex flex-col">
      <strong class="font-extrabold text-sm sm:text-lg">{item.name}</strong>
      <span class="text-sm font-medium">{item.creators}</span>
    </div>
  </div>
</a>
