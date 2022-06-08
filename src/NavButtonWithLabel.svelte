<script>
  export let isActive;
  export let label;
  export let target;
  
  
</script>


<a href={target} target={target.startsWith('http') ? '_blank' : ''} class={(isActive ? 'text-secondary dark:bg-dark dark:text-darkPrimary' : '') + " w-full group flex flex-col py-5 pl-4 text-sm font-medium"}>
  <div class="flex justify-start gap-3 items-center">
    <slot></slot>
  
    <div class="flex flex-col items-start">
      <h3 class="text-center"> {label}</h3>
      <div class={(isActive ? 'bg-secondary w-full' : '') + " w-5 mt-0.25 h-0.5 bg-primary group-hover:w-full ease-in-out duration-300"}></div>
    </div>
  </div>  
</a>
