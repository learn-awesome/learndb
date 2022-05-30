<script>
    import Icon from "./Icon.svelte"
    import MenuButton from "./MenuButton.svelte"
    let isNavDrawerOpen = false
    export let showNotificationBell = false;
    export let showProfileMenu = false;

</script>

<div >
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    {#if isNavDrawerOpen}
    <div class="relative z-40 md:hidden" role="dialog" aria-modal="true">
      <!--
        Off-canvas menu backdrop, show/hide based on off-canvas menu state.
  
        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
  
      <div class="fixed inset-0 flex z-40">
        <!--
          Off-canvas menu, show/hide based on off-canvas menu state.
  
          Entering: "transition ease-in-out duration-300 transform"
            From: "-translate-x-full"
            To: "translate-x-0"
          Leaving: "transition ease-in-out duration-300 transform"
            From: "translate-x-0"
            To: "-translate-x-full"
        -->
        <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-lightSecondary2 text-lightSecondary1 dark:bg-darkSecondary2 dark:text-darkSecondary1">
          <!--
            Close button, show/hide based on off-canvas menu state.
  
            Entering: "ease-in-out duration-300"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in-out duration-300"
              From: "opacity-100"
              To: "opacity-0"
          -->
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button on:click={e => isNavDrawerOpen = false} type="button" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="sr-only">Close sidebar</span>
              <!-- Heroicon name: outline/x -->
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <div class="flex-shrink-0 flex items-center px-4">
            <a href="#/" class="">LearnAwesome</a>
          </div>
          <div class="mt-5 flex-1 h-0 overflow-y-auto">
            <nav class="px-2 space-y-1">
              <slot name="sidebar"></slot>
            </nav>
          </div>
        </div>
  
        <div class="flex-shrink-0 w-14" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
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
        <div class="mt-5 flex-1 flex flex-col bg-lightTertiary text-lightBg">
          <nav class="flex-1 pb-4 space-y-1">
            <slot name="nav"></slot>
          </nav>
        </div>
      </div>
    </div>
    <div class="md:pl-64 flex flex-col flex-1">
      <div class="sticky top-0 z-10 flex-shrink-0 flex bg-cyan-900 text-white shadow">
        <button on:click={e => isNavDrawerOpen = true} type="button" class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
          <span class="sr-only">Open sidebar</span>
          <Icon kind="menu"/>
        </button>
        <div class="flex-1 flex justify-between">
          
          {#if showNotificationBell || showProfileMenu}
          <div class="ml-4 flex items-center md:ml-6">
            {#if showNotificationBell}
            <button type="button" class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span class="sr-only">View notifications</span>
              <Icon kind="bell"/>
            </button>
            {/if}

            {#if showProfileMenu}<MenuButton />{/if}
          </div>
          {/if}
        </div>
      </div>
  
      <main class="">
        <div class="py-6">
          <div class="max-w-none mx-auto px-4 sm:px-6 md:px-8">
            <slot name="content"></slot>
          </div>
        </div>
      </main>
    </div>
  </div>