<script>
	import { marked } from "marked";
	import { roadmap_progress } from "./stores.js"
	import { roadmap_data } from "./roadmap_data.js"

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

	function saveProgress(topic, item, status){
		let newobj = {};
      	newobj = Object.assign(newobj, $roadmap_progress)
    	if(!newobj[topic]) newobj[topic] = {};
		newobj[topic][item] = status;
      	roadmap_progress.set(newobj)
	}

	let selectedNode = $state();

	const roadmaps = {
		programming_in_golang: {
			start: {label: `${roadmap_data.start.label}`},
			blocks: [
				{	
					label: `${roadmap_data.blocks[0].label}`, 					
					left: [
						{
							label: `${roadmap_data.blocks[0].group1[0].label}`, 
							desc: `${roadmap_data.blocks[0].group1[0].desc}`
						},
						{
							label: `${roadmap_data.blocks[0].group1[1].label}`,
							desc: `${roadmap_data.blocks[0].group1[1].desc}`
						},
						{
							label: `${roadmap_data.blocks[0].group1[2].label}`,
							desc: `${roadmap_data.blocks[0].group1[2].desc}`
						},
					],
					middle: [
						{
							label: `${roadmap_data.blocks[0].group2[0].label}`,
							desc: `${roadmap_data.blocks[0].group2[0].desc}`
						},
						{
							label: `${roadmap_data.blocks[0].group2[1].label}`,
							desc: `${roadmap_data.blocks[0].group2[1].desc}`
						},
						{
							label: `${roadmap_data.blocks[0].group2[2].label}`,
							desc: `${roadmap_data.blocks[0].group2[2].desc}`
						},
					],
					right: [
						{
							label:`${roadmap_data.blocks[0].group3[0].label}`,
							desc: `${roadmap_data.blocks[0].group3[0].desc}`
						},
						{
							label:`${roadmap_data.blocks[0].group3[1].label}`,
							desc: `${roadmap_data.blocks[0].group3[1].desc}`
						},
						{
							label: `${roadmap_data.blocks[0].group3[2].label}`,
							desc: `${roadmap_data.blocks[0].group3[2].desc}`
						},
						{
							label: `${roadmap_data.blocks[0].group3[3].label}`,
							desc: `${roadmap_data.blocks[0].group3[3].desc}`
						},
						{
							label: `${roadmap_data.blocks[0].group3[4].label}`,
							desc: `${roadmap_data.blocks[0].group3[4].desc}`
						},
					]
				},
				{
					label: `${roadmap_data.blocks[1].label}`, 
					left: [
						{
							label: `${roadmap_data.blocks[1].group1[0].label}`,
							desc: `${roadmap_data.blocks[1].group1[0].desc}`
						},
						{
							label: `${roadmap_data.blocks[1].group1[1].label}`,
							desc: `${roadmap_data.blocks[1].group1[1].desc}`
						},
					],
					middle: [
						{
							label: `${roadmap_data.blocks[1].group2[0].label}`,
							desc: `${roadmap_data.blocks[1].group2[0].desc}`
						},
						{
							label: `${roadmap_data.blocks[1].group2[1].label}`,
							desc: `${roadmap_data.blocks[1].group2[1].desc}`
						},
					],
					right: [
						{
							label: `${roadmap_data.blocks[1].group3[0].label}`,
							desc: `${roadmap_data.blocks[1].group3[0].desc}`
						},
						{
							label: `${roadmap_data.blocks[1].group3[1].label}`,
							desc: `${roadmap_data.blocks[1].group3[1].desc}`
						},
						{
							label: `${roadmap_data.blocks[1].group3[2].label}`,
							desc: `${roadmap_data.blocks[1].group3[2].desc}`
						},
					]
				},

				{
					label: `${roadmap_data.blocks[2].label}`,
					left: [
						{
							label: `${roadmap_data.blocks[2].group1[0].label}`,
							desc: `${roadmap_data.blocks[2].group1[0].desc}`
						},
						{
							label: `${roadmap_data.blocks[2].group1[1].label}`,
							desc: `${roadmap_data.blocks[2].group1[1].desc}`
						},
					],
					middle: [
						{
							label: `${roadmap_data.blocks[2].group2[0].label}`,
							desc: `${roadmap_data.blocks[2].group2[0].desc}`
						},
						{
							label: `${roadmap_data.blocks[2].group2[1].label}`,
							desc: `${roadmap_data.blocks[2].group2[1].desc}`
						},
					],
					right: [
						{
							label: `${roadmap_data.blocks[2].group3[0].label}`,
							desc: `${roadmap_data.blocks[2].group3[0].desc}`
						},
						{
							label: `${roadmap_data.blocks[2].group3[1].label}`,
							desc: `${roadmap_data.blocks[2].group3[1].desc}`
						},
						{
							label: `${roadmap_data.blocks[2].group3[2].label}`,
							desc: `${roadmap_data.blocks[2].group3[2].desc}`
						},
					]
				},
			],
			edges: [
				{path: "M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z", style: "primary"},
				{path: "M 10,10 L 90,90 V 10 H 50", style: "secondary"},
			],
			end: {label: `${roadmap_data.end.label}`}
		},
	};

	let roadmap = $derived(roadmaps[topic]);

</script>

<span>
<h1 class="inline-block text-xl md:text-4xl font-extrabold mb-8">{topic.split('_').map(capitalize).join(' ')}</h1>
</span>
<div class="">
	{#if roadmap}
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox={`0 -130 1000 ${blockHeight*roadmap.blocks.length+300}`} style="font-family: balsamiq">
		<defs>
			<marker
			  id="triangle"
			  viewBox="0 0 20 20"
			  refX="1"
			  refY="5"
			  markerUnits="strokeWidth"
			  markerWidth="10"
			  markerHeight="10"
			  orient="auto">
			  <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
			</marker>
		</defs>
		<path d={`M ${500},${-200} L ${500},${0}`} class="secondary"/>
		<g>
			<rect 
				class="dummy"
				x={370} y={-100} rx={10}
				width={250}
				height={50}
				>
			</rect>
			<text
				class="dummy"
				x={410}
				y={-100+nodeHeight-20}
			><tspan>{roadmap.start.label}</tspan></text>
		</g>
		{#each roadmap.blocks as node,i (node.label)}
			<g>
				<rect 
					class="primary"
					x={0} y={blockHeight*i} rx={10}
					width={990}
					height={blockHeight-100}>
				</rect>
				<text
					class="primary"
					x={350}
					y={blockHeight*i+60}
				><tspan>{node.label}</tspan></text>
			</g>

			{#each node.left as sec, j}
			<g>
				<rect 
					class="secondary"
					fill={$roadmap_progress[topic] && $roadmap_progress[topic][sec.label] == 'done' ? '#ccc' : 'rgb(255,229,153)'}
					x={20} y={30+blockHeight*i+50*j} rx={5}
					onclick={e => selectedNode = sec}
					width={250}
					height={45}>
				</rect>
				<text
					class="secondary"
					text-decoration={$roadmap_progress[topic] && $roadmap_progress[topic][sec.label] == 'done' ? 'line-through' : 'none'}
					onclick={e => selectedNode = sec}
					x={20+10}
					y={30+blockHeight*i+50*j+30}
				><tspan>{sec.label}</tspan></text>
			</g>
			{/each}

			{#each node.middle as sec,j}
			<g>
				<rect 
					class="secondary"
					fill={$roadmap_progress[topic] && $roadmap_progress[topic][sec.label] == 'done' ? '#ccc' : 'rgb(255,229,153)'}
					onclick={e => selectedNode = sec}
					x={350} y={140+blockHeight*i+50*j} rx={5}
					width={250}
					height={45}>
				</rect>
				<text
					class="secondary"
					text-decoration={$roadmap_progress[topic] && $roadmap_progress[topic][sec.label] == 'done' ? 'line-through' : 'none'}
					onclick={e => selectedNode = sec}
					x={350+10}
					y={140+blockHeight*i+50*j+30}
				><tspan>{sec.label}</tspan></text>
			</g>
			{/each}

			{#each node.right as sec, j}
			<g>
				<rect 
					class="secondary"
					fill={$roadmap_progress[topic] && $roadmap_progress[topic][sec.label] == 'done' ? '#ccc' : 'rgb(255,229,153)'}
					onclick={e => selectedNode = sec}
					x={720} y={30+blockHeight*i+50*j} rx={5}
					width={250}
					height={45}>
				</rect>
				<text
					class="secondary"
					text-decoration={$roadmap_progress[topic] && $roadmap_progress[topic][sec.label] == 'done' ? 'line-through' : 'none'}
					onclick={e => selectedNode = sec}
					x={720+10}
					y={30+blockHeight*i+50*j+30}
				><tspan>{sec.label}</tspan></text>
			</g>
			{/each}

			<path d={`M ${270},${blockHeight*i+10+50*(roadmap.blocks[i].left.length)} L ${(270+350)/2},${(blockHeight*i+10+50*(roadmap.blocks[i].left.length)+140+nodeHeight/2+blockHeight*i)/2} L ${350},${140+nodeHeight/2+blockHeight*i}`} class="secondary" marker-mid="url(#triangle)"/>
			<path d={`M ${350+nodeWidth},${140+blockHeight*i+50*(roadmap.blocks[i].middle.length)-nodeHeight/2} L ${(350+nodeWidth+720)/2},${(140+blockHeight*i+50*(roadmap.blocks[i].middle.length)-nodeHeight/2+blockHeight*i+nodeHeight)/2} L ${720},${blockHeight*i+nodeHeight}`} class="secondary" marker-mid="url(#triangle)"/>

			{#if i > 0}
			<!-- from bottom of right of previous node to to of left of this one -->
			<path d={`M ${880},${blockHeight*(i-1)+30+50*(roadmap.blocks[i-1].right.length)} C ${500+300},${blockHeight*(i-1)+30+50*(roadmap.blocks[i-1].right.length)+100} ${500-300},${blockHeight*i-50}, ${140},${blockHeight*i+25}`} class="primary" marker-end="url(#triangle)"/>
			{/if}
		{/each}
		<path d={`M ${500},${blockHeight*roadmap.blocks.length-100} L ${500},${blockHeight*roadmap.blocks.length+100}`} class="secondary"/>
		<g>
			<rect 
				class="dummy"
				x={370} y={blockHeight*roadmap.blocks.length} rx={10}
				width={300}
				height={50}>
			</rect>
			<text
				class="dummy"
				x={390}
				y={blockHeight*roadmap.blocks.length+nodeHeight/2+5}
			><tspan>{roadmap.end.label}</tspan></text>
		</g>
	</svg>
	{:else}
		<p class="text-center">Coming soon.</p>
	{/if}
</div>

<sl-drawer open={selectedNode} class="drawer-overview" style="--size: 50vw;">
	{#if selectedNode}
		{#if $roadmap_progress[topic] && $roadmap_progress[topic][selectedNode.label] === 'done'}
			<sl-button variant="danger" onclick={e => saveProgress(topic, selectedNode.label, 'pending')}>Mark as Pending</sl-button>
		{:else}
			<sl-button variant="success" onclick={e => saveProgress(topic, selectedNode.label, 'done')}>Mark as Done</sl-button>
		{/if}
	<div class="mt-8 prose">
		{@html marked(selectedNode?.desc || "", { renderer })}
	</div>
	{/if}
	<sl-button slot="footer" variant="primary" onclick={e => selectedNode = null}>Close</sl-button>
</sl-drawer>

<style>
	rect {
		stroke: #ccc;
	}

	rect.primary {
		fill: #e1e1f7;
		stroke-width: 1px;
		filter: drop-shadow(2px 1px 1px #999);
	}

	text.primary {
		font: bold 24px sans-serif;
	}

	rect.secondary {
		stroke-width: 1px;
		stroke: #999;
	}

	rect.dummy {
		fill: #fcfcfc;
		stroke-width: 1px;
		stroke: #ccc;
	}

	text.secondary, text.dummy {
		font: normal 14px sans-serif;
	}

	g:hover rect.secondary {
		filter: invert(5%) drop-shadow(2px 1px 1px #999);
		cursor: pointer;
	}

	g:hover text.secondary {
		cursor: pointer;
	}

	path.primary {
		fill: none;
		stroke: #333;
		stroke-width: 5px;
		stroke-dasharray: 5 5;
	}

	path.secondary {
		fill: none;
		stroke: #333;
		stroke-width: 3px;
		stroke-dasharray: 5 3;
	}
</style>