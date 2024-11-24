<script>
	import { scale } from 'svelte/transition';
	import { cubicIn } from 'svelte/easing';

  let graph = {
	  name: "Top",
	  children: [
		  {name: "first", children: [
			  {name: "first -> A", children: [], color: "red-500"},
			  {name: "first -> B", children: [], color: "green-500"},
			  {name: "first -> c", children: [], color: "yellow-500"},
			  {name: "first -> d", children: [], color: "blue-500"},
		  ], pos: [], size: 35, color: "green-300"},
		  {name: "second", children: [], pos: [], size: 35, color: "red-500"},
		  {name: "third", children: [], pos: [], size: 35, color: "yellow-500"},
		  {name: "fourth", children: [], pos: [], size: 35, color: "teal-400"},
	  ]

  }
  
  let currentParent = $state(null);
  let currentChild = $state(graph);

  function findParent(child, tree){
	  if(graph == child) return null;
	  if(tree.children.indexOf(child) > -1) return tree;
	  // Will have to look at grandchildren
	  tree.children.forEach(c => {
		  let x = findParent(child, c);
		  if (x != -1) return c;
	  });
	  return -1;
  }

  function switchTo(parent, child){
	  [currentParent, currentChild] = [parent, child];
  }

  function siblings(parent, child){
	if(!parent) return [];
	return parent.children.filter(n => n != child)
  }



</script>

<div class="flex flex-col">

	{#if currentParent}<div class="flex flex-row justify-center mb-4">
		<span>
			<button type="button" onclick={e => switchTo(findParent(currentParent, graph), currentParent)} class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				{currentParent.name}
			</button>
		</span>
	</div>{/if}

	<h2 class="text-3xl my-4 text-center font-extrabold tracking-tight sm:text-4xl">{currentChild.name}</h2>

	<div class="flex flex-row justify-center my-4">
		<span class="relative z-0 inline-flex shadow-sm rounded-md">
			{#each siblings(currentParent, currentChild) as sibling}
			<button type="button" onclick={e => switchTo(currentParent, sibling)} class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
				{sibling.name}
			</button>
			{/each}
		</span>
	</div>

</div>

<div class="grid grid-cols-1 gap-y-0 sm:grid-cols-2 mt-4">
	{#each currentChild.children as grandchild, i (grandchild)}
	<button onclick={e => switchTo(currentChild, grandchild)} class="h-96 bg-{grandchild.color} hover:opacity-80 hover:scale-105">
		<h3>{grandchild.name}</h3>
	</button>
	{/each}
</div>