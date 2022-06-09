<script>
    import Icon from "./Icon.svelte"
    let isNavDrawerOpen = false
    export let showNotificationBell = false;
    export let showProfileMenu = false;

    const randint = (min, max) => min + Math.round(Math.random() * (max - min))
    const randomHue = () => randint(0,360)

    function themeRandomize(){
      // TODO: Be more smarter than trying random hues
      var hues = [randomHue(), randomHue(), randomHue(), randomHue(), randomHue(), randomHue(), randomHue()]
      var saturation = randint(0,100)
      var lightness = randint(0,100)
      
      tailwind.config.theme.extend.colors.primary = `hsl(${hues[0]}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.primary_light = `hsl(${hues[1]}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.neutral_light = `hsl(${hues[2]}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.neutral_dark = `hsl(${hues[3]}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.secondary = `hsl(${hues[4]}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.lightGradOne = `hsl(${hues[5]}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.lightGradTwo = `hsl(${hues[6]}, ${saturation}%, ${lightness}%)`;

      tailwind.config.theme.extend.colors.darkPrimary = `hsl(${(hues[0] + 180) % 360}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.darkSecondary = `hsl(${(hues[1] + 180) % 360}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.darkTertiary = `hsl(${(hues[2] + 180) % 360}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.darkBg = `hsl(${(hues[3] + 180) % 360}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.darkPrimCont = `hsl(${(hues[4] + 180) % 360}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.darkButtonBg = `hsl(${(hues[5] + 180) % 360}, ${saturation}%, ${lightness}%)`;
      tailwind.config.theme.extend.colors.dark = `hsl(${(hues[6] + 180) % 360}, ${saturation}%, ${lightness}%)`;

    }

</script>

<div >
  <!-- sticky top bar  -->
  <div class="sticky top-0 z-10 flex-shrink-0 flex text-primary_light bg-primary shadow">
    {#if isNavDrawerOpen == false}
    <button on:click={e => isNavDrawerOpen = true} type="button" class="px-4 border-r border-primary_light text-primary_light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden">
      <span class="sr-only">Open sidebar</span>
      <Icon kind="menu"/>
    </button>
    {/if}

    {#if isNavDrawerOpen}
    <button on:click={e => isNavDrawerOpen = false} type="button" class="px-4 border-r border-primary_light text-primary_light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden">
      <span class="sr-only">Close sidebar</span>
      <Icon kind="close"/>
    </button>
    {/if}

    <div class=" py-3 flex flex-col items-center flex-shrink-0 px-4 tracking-wider font-bold group">
      <a href="/" class="">LearnAwesome</a>
      <div class="w-1/5 mt-0.25 h-0.5 bg-primary group-hover:w-full ease-in-out duration-300"></div>
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
  <!-- main container  -->
  <div class="md:pl-64 flex flex-col flex-1">
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
    <div class="fixed inset-0 bg-neutral_Light bg-opacity-75 mt-12" on:click={e => isNavDrawerOpen = false}></div>

    <div class="fixed inset-y-0 left-0 flex z-50 mt-12">
      <div class="relative flex-1 flex flex-col w-64 w-full pt-5 pb-4 bg-primary_light text-primary dark:bg-neutral_dark dark:text-primary_light">
        <div class="md:ml-6 flex-1 h-0 overflow-y-auto">
          <nav class="px-4 space-y-1" on:click={e => isNavDrawerOpen = false}>
            <slot name="nav"></slot>
            {#if window.location.href.startsWith('http://127.0.0.1')}
            <button class="" on:click={themeRandomize}>Randomize</button>
            {/if}
          </nav>
        </div>
      </div>
    </div>
  </div>
  {/if}

  <!-- Static sidebar for desktop -->
  <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
    <!-- Sidebar component -->
    <div class="flex flex-col flex-grow border-r-8 overflow-y-auto">
      <!-- <div class="flex flex-col items-center flex-shrink-0 px-4 tracking-wider font-bold text-primary">
        <a href="/" class="">LearnAwesome</a>
        <div class="w-1/5 mt-0.25 h-0.5 bg-primary group-hover:w-full ease-in-out duration-300"></div>
      </div> -->
      <div class="mt-12 flex-1 flex flex-col bg-primary_light text-primary">
        <nav class="flex-1 pb-4 space-y-1 pt-5">
          <slot name="nav"></slot>
          {#if window.location.href.startsWith('http://127.0.0.1')}
            <button class="" on:click={themeRandomize}>Randomize</button>
            {/if}
        </nav>
      </div>
    </div>
  </div>   
</div>