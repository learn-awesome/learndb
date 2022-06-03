<script>
  export let options = [];
  export let userInput = '';
  $: filteredOptions = options.filter(x => x.label.startsWith(userInput))
  $: console.log({options})
  $: console.log(filteredOptions)
  $: console.log({userInput})
</script>

<sl-dropdown class="ml-2">
  <sl-input 
    slot="trigger" 
    class="p-0 m-0 border-0"
    on:sl-input="{e => userInput = e.target.value}" 
    value={userInput}
    placeholder="select topic">
  </sl-input>

  <sl-menu>
    {#each filteredOptions as opt (opt.value)}
    <sl-menu-item on:click="{e => userInput = opt.value}">{opt.label}</sl-menu-item>
    {/each}
  </sl-menu>
</sl-dropdown>
