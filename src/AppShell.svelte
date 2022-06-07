<script>
    import Icon from "./Icon.svelte"
    let isNavDrawerOpen = false
    export let showNotificationBell = false;
    export let showProfileMenu = false;

    const randint = (min, max) => min + Math.round(Math.random() * (max - min))

    function themeRandomize(){
      var hue = randint(0,360)
      var saturation = randint(0,100)
      var lightness = randint(0,100)

      let primary = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      let opposite = `hsl(${(hue + 180) % 360}, ${saturation}%, ${100-lightness}%)`;
      tailwind.config.theme.extend.colors.lightTertiary = primary;
      tailwind.config.theme.extend.colors.lightBg = opposite;
      console.log({primary});
      console.log({opposite});
    }

</script>

<div >
  <div class="md:pl-64 flex flex-col flex-1">
    <div class=" sticky top-0 z-10 flex-shrink-0 flex bg-lightPrimary text-lightPrimCont shadow">
      {#if isNavDrawerOpen == false}
      <button on:click={e => isNavDrawerOpen = true} type="button" class="px-4 border-r border-gray-200 text-lightPrimCont focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
        <span class="sr-only">Open sidebar</span>
        <Icon kind="menu"/>
      </button>
      {/if}

      {#if isNavDrawerOpen}
      <button on:click={e => isNavDrawerOpen = false} type="button" class="px-4 border-r border-gray-200 text-lightPrimCont focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
        <span class="sr-only">Close sidebar</span>
        <Icon kind="close"/>
      </button>
      {/if}

      <div class="md:hidden py-3 flex flex-col items-center flex-shrink-0 px-4 tracking-wider font-bold text-lightPrimCont group">
        <a href="/" class="">LearnAwesome</a>
        <div class="w-1/5 mt-0.25 h-0.5 bg-light group-hover:w-full ease-in-out duration-300"></div>
      </div>

      <div class="flex-1 flex justify-between">
        
        {#if showNotificationBell || showProfileMenu}
        <div class="ml-4 flex items-center md:ml-6">
          {#if showNotificationBell}
          <button type="button" class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="sr-only">View notifications</span>
            <Icon kind="bell"/>
          </button>
          {/if}

        </div>
        {/if}
      </div>
    </div>

    <!-- content  -->
    <main class="">
      <div class="py-6">
        <div class="max-w-none mx-auto px-4 sm:px-6 md:px-8">
          <slot name="content"></slot>
        </div>
      </div>
    </main>
  </div>
  <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
  {#if isNavDrawerOpen}
  <div class="relative z-40 md:hidden" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-lightSecondary bg-opacity-75 mt-12" on:click={e => isNavDrawerOpen = false}></div>

    <div class="fixed inset-y-0 left-0 flex z-50 mt-12">
      <div class="relative flex-1 flex flex-col w-64 w-full pt-5 pb-4 bg-lightPrimary text-lightBg dark:bg-darkSecondary dark:text-darkBg">
        <!-- <div class="absolute top-0 right-0 -mr-12 pt-2"> -->
          
          <!-- <button on:click={e => isNavDrawerOpen = false} type="button" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">Close sidebar</span> -->
            <!-- Heroicon name: outline/x -->
            <!-- <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button> -->
        <!-- </div> -->

        <!-- <div class="flex-shrink-0 flex items-center tracking-wider font-bold text-lightPrimCont">
          <a href="#/" class="">LearnAwesome</a>
        </div> -->
        <div class="ml-6 flex-1 h-0 overflow-y-auto">
          <nav class="px-4 space-y-1" on:click={e => isNavDrawerOpen = false}>
            <slot name="nav"></slot>
            {#if window.location.href.startsWith('http://127.0.0.1')}
            <button class="" on:click={themeRandomize}>Randomize</button>
            {/if}
          </nav>
        </div>
      </div>

      <!-- <div class="flex-shrink-0 w-14" aria-hidden="true"> -->
        <!-- Dummy element to force sidebar to shrink to fit close icon -->
      <!-- </div> -->
    </div>
  </div>
  {/if}

  <!-- Static sidebar for desktop -->
  <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div class="flex flex-col flex-grow pt-5 border-r overflow-y-auto">
      <div class="flex items-center flex-shrink-0 px-4 tracking-wider font-bold text-lightTertiary">
        <a href="/" class="">LearnAwesome</a>
      </div>
      <div class="mt-5 flex-1 flex flex-col bg-lightPrimary text-lightBg">
        <nav class="flex-1 pb-4 space-y-1">
          <slot name="nav"></slot>
        </nav>
      </div>
    </div>
  </div>   
</div>