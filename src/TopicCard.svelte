<script>
    export let topic;
    import Icon from "./tailwindui/Icon.svelte"

    $: abbr = topic.display_name.slice(0,2).toUpperCase()
</script>

<li class="col-span-1 flex shadow-sm rounded-md">
    <div class="flex-shrink-0 flex items-center justify-center w-16 bg-pink-600 text-white text-sm font-medium rounded-l-md">{abbr}</div>
    <div class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
      <div class="flex-1 px-4 py-2 text-sm truncate">
        <a href={"/topic/" + topic.id} class="text-gray-900 font-medium hover:text-gray-600">{topic.display_name}</a>
        <p class="text-gray-500">{topic.rowid} items</p>
      </div>
      <div class="flex-shrink-0 pr-2">
        <button type="button" class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="sr-only">Open options</span>
          <Icon kind="dots"/>
        </button>
      </div>
    </div>
  </li>