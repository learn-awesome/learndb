<script>
  export let isActive;
  export let label;
  export let target;
  
  
</script>


<a 
  href={target}
  class={(isActive ? 'sm:bg-lightPrimCont sm:text-lightPrimary sm:dark:bg-darkPrimCont sm:dark:text-darkPrimary' : '') + " w-full hover:bg-lightBg hover:dark:text-darkPrimary hover:dark:bg-darkBg hover:text-lightPrimary group flex justify-start gap-3 items-center py-5 pl-4 text-sm font-medium"}>
  <slot></slot>
  
  <h3 class="text-center"> {label}</h3>
</a>
