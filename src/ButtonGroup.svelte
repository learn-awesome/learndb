<script>
  import { createEventDispatcher } from 'svelte';

  
  const dispatch = createEventDispatcher();
  export let tabs = ['first', 'second'];
  export let currentlySelected = undefined;

  function changeStatus(val){
    currentlySelected = val;
    dispatch('change', {value: val})
  }
  
</script>

<span class="relative z-0 inline-flex rounded-md mt-5 flex-nowrap">
  {#each tabs as tab, i}
  <button 
     type="button" 
     on:click="{e => changeStatus(currentlySelected === i? undefined : i)}"
     class="
       relative inline-flex flex-nowrap items-center px-4 py-2 
      {i == 0 && 'rounded-l-md'}
      {i == tabs.length-1 && 'rounded-r-md'} 
      border text-sm font-medium hover:scale-x-110 focus:z-10 focus:outline-none 
      {currentlySelected === i? 'bg-secondary text-primary_light' : 'bg-primary text-primary_light'}
     "
  >
     {tab}
  </button>
  {/each}                   
  

</span>

