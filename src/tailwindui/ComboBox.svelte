<script>
    export let options = [];
    export let selected = {};
</script>

<div>
    <div class="relative ml-2">
      <input type="text" class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-12 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" role="combobox" aria-controls="options" aria-expanded="false" value={selected && selected.label}>
      <button type="button" class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <!-- Heroicon name: solid/selector -->
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
  
      <ul class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm hidden" id="options" role="listbox">
        {#each options as option}
        <!--
          Combobox option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.
  
          Active: "text-white bg-indigo-600", Not Active: "text-gray-900"
        -->
        <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900" role="option" tabindex="-1">
          <!-- Selected: "font-semibold" -->
          <span class={(selected && selected.value == option.value ? 'font-semibold' : '') + ' block truncate'}>{option.label}</span>
  
          <!--
            Checkmark, only display for selected option.
  
            Active: "text-white", Not Active: "text-indigo-600"
          -->
          {#if selected && selected.value == option.value}
          <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
            <!-- Heroicon name: solid/check -->
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
          {/if}
        </li>
        {/each}
      </ul>
    </div>
</div>