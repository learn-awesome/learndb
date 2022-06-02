<script>
  export let options = [];
  let userInput = '3';
  $: filteredOptions = options.filter(x => x.label.startsWith(userInput))
  $: console.log(userInput)
</script>

<sl-dropdown>
  <sl-input slot="trigger" on:change="{e => userInput = e.target.value}" value={userInput}></sl-input>
  <sl-menu>
    {#each filteredOptions as opt (opt.value)}
    <sl-menu-item>{opt.label}</sl-menu-item>
    {/each}
  </sl-menu>
</sl-dropdown>
