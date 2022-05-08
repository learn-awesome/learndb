<script>
  import Icon from "./Icon.svelte"
  let query;
  let results = [];

  function handleSubmit(ev){
    console.log({query})
  }
</script>

<form class="w-full flex md:ml-0" on:submit|preventDefault={handleSubmit}>
    <label for="search-field" class="sr-only">Search</label>
    <div class="relative w-full text-gray-400 focus-within:text-gray-600">
      <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
          <Icon kind="search"/>
      </div>
      <input bind:value={query} class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search">
    </div>
</form>

<ul class="max-h-80 scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2" id="options" role="listbox">
  <li>
    <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900">Clients</h2>
    <ul class="mt-2 text-sm text-gray-800">
      <!-- Active: "bg-indigo-600 text-white" -->
      <li class="cursor-default select-none px-4 py-2" id="option-1" role="option" tabindex="-1">Workflow Inc.</li>
      <li class="cursor-default select-none px-4 py-2" id="option-2" role="option" tabindex="-1">Multinational LLC.</li>
    </ul>
  </li>
  <li>
    <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900">Projects</h2>
    <ul class="mt-2 text-sm text-gray-800">
      <!-- Active: "bg-indigo-600 text-white" -->
      <li class="cursor-default select-none px-4 py-2" id="option-3" role="option" tabindex="-1">Workflow Inc. / Website Redesign</li>
      <li class="cursor-default select-none px-4 py-2" id="option-3" role="option" tabindex="-1">Multinational LLC. / Animation</li>
    </ul>
  </li>
</ul>