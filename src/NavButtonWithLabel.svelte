<script>
  export let isActive;
  export let label;
  export let target;
  
  
</script>


<a href={target} target={target.startsWith('http') ? '_blank' : ''} class={(isActive ? 'bg-lightPrimCont text-lightPrimary dark:bg-darkPrimCont dark:text-darkPrimary' : '') + " text-lightSecondary1 w-full hover:bg-lightSecondary1 hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg hover:text-lightSecondary2 group flex justify-start gap-3 items-center py-5 pl-4 text-sm font-medium"}>
  <slot></slot>
  
  <h3 class="text-center"> {label}</h3>
</a>
