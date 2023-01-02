<script>
  export let isActive;
  export let label;
  export let target;
  
  
</script>


<a href={target} target={target.startsWith('http') ? '_blank' : ''} class={(isActive ? 'text-cyan-500 ' : '') + " sw-full group flex flex-col py-5 pl-4 text-sm font-medium"}>
  <div class="flex justify-start gap-3 items-center">
    <slot></slot>
  
    <div class="flex flex-col items-start">
      <h3 class={(isActive ? 'text-cyan-500' : 'text-slate-900 dark:text-slate-100') + " text-center text-xl"}> {label}</h3>
      <div class={(isActive ? 'bg-cyan-500 w-full ' : 'bg-slate-900 dark:bg-slate-100 w-5') + " mt-0.25 h-0.5 group-hover:w-full ease-in-out duration-300"}></div>
    </div>
  </div>  
</a>
