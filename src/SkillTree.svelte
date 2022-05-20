<script>
	import ZoomSvg from '@svelte-parts/zoom/svg'
    import { fly } from 'svelte/transition';
    
	
	let sidePanelShown = true;
	let currentNode = null;
	let nodes = [
		{id: 1, name: "test", x: 100, y: 200, size: 50, color: "#ff3e00"},
		{id: 2, name: "second", x: 400, y: 300, size: 30, color: "#ff3eff"}
	]
	
	let edges = [
		{id: 1, from: nodes[0], to: nodes[1]}
	]
	
	function handleNodeMouseEnter(ev){
		ev.target.style.fill = "#aa3e00"
	}
	
	function handleNodeMouseLeave(ev){
		ev.target.style.fill = "#ff3e00"
	}
	
	function handleNodeClick(ev){
		sidePanelShown = true;
		currentNode = ev.target;
	}
</script>


<ZoomSvg viewBox="0 0 1200 900">

{#each edges as edge}
	<line x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y} stroke="black" stroke-width="5" />
{/each}
	
{#each nodes as node}
	<circle cx={node.x} cy={node.y} r={node.size} fill={node.color} on:mouseenter={handleNodeMouseEnter} on:mouseleave={handleNodeMouseLeave} on:click={handleNodeClick}/>
{/each}

<g>
	<rect x="120" y="320" width="100" height="100" fill="none" stroke="black" rx="15" />
	<text x="400" y="150" font-family="Verdana" font-size="85" fill="green" stroke="yellow">Hello</text>
</g>
	
</ZoomSvg>


<div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <!-- Background backdrop, show/hide based on slide-over state. -->
    {#if sidePanelShown}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    {/if}
  
    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          {#if sidePanelShown}
          <div class="pointer-events-auto w-screen max-w-md" transition:fly="{{ x: 200, duration: 600 }}">
            <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
              <div class="px-4 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Panel title</h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button on:click="{e => sidePanelShown = false}" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span class="sr-only">Close panel</span>
                      <!-- Heroicon name: outline/x -->
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="relative mt-6 flex-1 px-4 sm:px-6">
                <!-- Replace with your content -->
                <div class="absolute inset-0 px-4 sm:px-6">
                  <div class="h-full border-2 border-dashed border-gray-200" aria-hidden="true"></div>
                </div>
                <!-- /End replace -->
              </div>
            </div>
          </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  