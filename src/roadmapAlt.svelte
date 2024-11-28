<script>
    import { Svelvet } from "svelvet";
    import { roadmap_data } from "./roadmap_data";
    import { marked } from "marked";
	import { roadmap_progress } from "./stores.js"

    const renderer = $state(new marked.Renderer());
	const linkRenderer = renderer.link;
	renderer.link = (href, title, text) => {
		const localLink = href.startsWith(`${location.protocol}//${location.hostname}`);
		const html = linkRenderer.call(renderer, href, title, text);
		return localLink ? html : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
	};

	let { topic } = $props();


	
    const capitalize = s => s && s[0].toUpperCase() + s.slice(1);
	const blockHeight = 400;
	const nodeHeight = 50;
	const nodeWidth = 250;

    let roadmap_edit = $state(false);

    function saveProgress(topic, item, status){
		let newobj = {};
      	newobj = Object.assign(newobj, $roadmap_progress)
    	if(!newobj[topic]) newobj[topic] = {};
		newobj[topic][item] = status;
      	roadmap_progress.set(newobj)
	}

	let selectedNode = $state();

    let roadmap = $derived(roadmap_data[topic]);

	const initialNodes = [
	  {
	    id: 1,
	    position: { x: 240, y: 50 },
	    data: { label: roadmap_data.start.label },
	    width: 200,
	    height: 60,
	    bgColor: "white",
        childNodes: [2, 3, 4]
	  },
	  {
	    id: 2,
	    position: { x: 40, y: 250 },
	    data: { label: roadmap_data.blocks[0].label},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        childNodes: [5]
	  },
      {
	    id: 3,
	    position: { x: 240, y: 250 },
	    data: { label: roadmap_data.blocks[1].label},
	    width: 175,
	    height: 40,
	    bgColor: "white",
	  },
      {
	    id: 4,
	    position: { x: 440, y: 250 },
	    data: { label: roadmap_data.blocks[2].label},
	    width: 175,
	    height: 40,
	    bgColor: "white",
	  },
      {
	    id: 5,
	    position: { x: 40, y: 350 },
	    data: { label: "Section 1"},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        childNodes: [8, 9, 10]
	  },
      {
	    id: 6,
	    position: { x: 40, y: 600 },
	    data: { label: "Section 2"},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        childNodes: [11, 12, 13]
	  },
      {
	    id: 7,
	    position: { x: 40, y: 850 },
	    data: { label: "Section 3", desc: `test`},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        childNodes: [14, 15, 16]
	  },
      {
	    id: 8,
	    position: { x: 40, y: 400 },
	    data: { label: roadmap_data.blocks[0].group1[0].label, desc: roadmap_data.blocks[0].group1[0].desc},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      {
	    id: 9,
	    position: { x: 40, y: 450 },
	    data: { label: roadmap_data.blocks[0].group1[1].label, desc: roadmap_data.blocks[0].group1[1].desc},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      {
	    id: 10,
	    position: { x: 40, y: 500 },
	    data: { label: roadmap_data.blocks[0].group1[2].label, desc: roadmap_data.blocks[0].group1[2].desc},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      {
	    id: 11,
	    position: { x: 40, y: 650 },
	    data: { label: roadmap_data.blocks[0].group2[0].label, desc: roadmap_data.blocks[0].group2[0].desc},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      {
	    id: 12,
	    position: { x: 40, y: 700 },
	    data: { label: roadmap_data.blocks[0].group2[1].label, desc: roadmap_data.blocks[0].group2[1].desc},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      {
	    id: 13,
	    position: { x: 40, y: 750 },
	    data: { label: roadmap_data.blocks[0].group2[2].label, desc: roadmap_data.blocks[0].group2[1].desc},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      {
	    id: 14,
	    position: { x: 40, y: 900 },
	    data: { label: roadmap_data.blocks[0].group3[0].label, desc: roadmap_data.blocks[0].group3[0].desc},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      {
	    id: 15,
	    position: { x: 40, y: 950 },
	    data: { label: roadmap_data.blocks[0].group3[1].label}, desc: roadmap_data.blocks[0].group3[1].desc,
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      {
	    id: 16,
	    position: { x: 40, y: 1000 },
	    data: { label: roadmap_data.blocks[0].group3[2].label, desc: roadmap_data.blocks[0].group3[2].desc},
	    width: 175,
	    height: 40,
	    bgColor: "white",
        clickCallback: node => selectedNode = node.id,
	  },
      
      
	];

    
	const initialEdges = [
	  { id: "e1-2", source: 1, target: 2, label: roadmap_data.blocks[0].label},
      { id: "e1-3", source: 1, target: 3, label: roadmap_data.blocks[1].label},
      { id: "e1-4", source: 1, target: 4, label: roadmap_data.blocks[2].label},
      { id: "e2-5", source: 2, target: 5},
      { id: "e2-6", source: 2, target: 6},
      { id: "e2-7", source: 2, target: 7},
      { id: "5-8", source: 5, target: 8},
      { id: "5-9", source: 5, target: 9},
      { id: "5-10", source: 5, target: 10},
      { id: "6-11", source: 6, target: 11},
      { id: "6-12", source: 6, target: 12},
      { id: "6-13", source: 6, target: 13},
      { id: "7-14", source: 7, target: 14},
      { id: "7-15", source: 7, target: 15},
      { id: "7-16", source: 7, target: 16},

	];
</script>
<button class="inline-block py-2 px-6 bg-gray-800 text-white rounded-lg absolute right-2" onclick={()=>roadmap_edit = true}>{'Enable Editing'}</button>
<div class="w-full margin-auto flex items-center justify-center">
    <Svelvet 
    width={1000} 
    height={1200}
    nodes={initialNodes} 
    edges={initialEdges} 
    movement={false}
    nodeCreate={roadmap_edit}
    editable={roadmap_edit}
    background
    />
</div>
  

<span>
   
    </span>
    
    <sl-drawer open={selectedNode} class="drawer-overview" style="--size: 50vw;">
        {#if selectedNode}
            {#if $roadmap_progress[topic] && $roadmap_progress[topic][selectedNode.label] === 'done'}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <sl-button variant="danger" onclick={e => saveProgress(topic, selectedNode.label, 'pending')}>Mark as Pending</sl-button>
            {:else}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <sl-button variant="success" onclick={e => saveProgress(topic, selectedNode.label, 'done')}>Mark as Done</sl-button>
            {/if}
        <div class="mt-8 prose">
            {@html marked(selectedNode? initialNodes[selectedNode-1].data.desc : "", { renderer })}
        </div>
        {/if}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <sl-button slot="footer" variant="primary" onclick={e => selectedNode = null}>Close</sl-button>
    </sl-drawer>