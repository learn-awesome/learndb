<script>
	import * as Pancake from '@sveltejs/pancake';
	import * as d3 from 'd3-hierarchy';
	import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import * as yootils from 'yootils';
	import PancakeTreemap from './PancakeTreemap.svelte';
	import topics from '../db/topics.json';

	const treemap = d3.treemap();

	const build_hierarchy = (topic_array, parent_name) => {
		// this is different from TopicMasonryGrid because this needs a specific object structure down to all leafs, not a map with just 2 levels
		// every node needs id, name. Leaf nodes need a value like 100. Non-leafs need a children[].
		// see: https://github.com/mekarpeles/math.mx/blob/master/static/data/simple.json
		const nest = (items, id) =>
		items
		.filter(item => item.parent_name === id)
		.map(item => ({ ...item, children: nest(items, item.name), value: 100 }))
		.map(item => {
			return item.children.length == 0 ?
			{id: item.name, name: item.name, value: 100} :
			{id: item.name, name: item.name, children: item.children}
		});

		let topnodes = nest(topic_array, null); // includes childless nodes

		// put childless nodes under misc
		let misc = {id: 'misc', name: 'Misc', children: topnodes.filter(t => t.value).slice(0,15)};


		return {name: "", children: [...topnodes.filter(t => t.children), misc]};
	}

	const hierarchy = d3.hierarchy(build_hierarchy(topics, null))
		.sum(d => d.value)
		.sort((a, b) => b.value - a.value)

	const root = treemap(hierarchy);

	let selected = root;

	const select = node => {
		while (node.parent && node.parent !== selected) {
			node = node.parent;
		}

		if (node && node.children) {
			selected = node;
		} else {
			window.location.href = "/#/topic/" + node.data.name;
		}
	};

	const breadcrumbs = node => {
		const crumbs = [];
		while (node) {
			crumbs.unshift(node.data.name)
			node = node.parent;
		}

		return crumbs.join('/');
	};

	const extents = tweened(undefined, {
		easing: eases.cubicOut,
		duration: 600
	});

	const is_visible = (a, b) => {
		while (b) {
			if (a.parent === b) return true;
			b = b.parent;
		}

		return false;
	};

	$: $extents = {
		x1: selected.x0,
		x2: selected.x1,
		y1: selected.y1,
		y2: selected.y0
	};
</script>

<button class="breadcrumbs" disabled="{!selected.parent}" on:click="{() => selected = selected.parent}">
	{breadcrumbs(selected)}
</button>

<div class="chart">
	<Pancake.Chart x1={$extents.x1} x2={$extents.x2} y1={$extents.y1} y2={$extents.y2}>
		<PancakeTreemap {root} let:node>
			{#if is_visible(node, selected)}
				<div
					transition:fade={{duration:400}}
					class="node"
					class:leaf={!node.children}
					on:click="{() => select(node)}"
				>
					<div class="pancontents">
						<strong on:click|stopPropagation={() => window.location.href = "/#/topic/" + node.data.name}>
							{node.data.name.split('/').reverse()[0]}
						</strong>
					</div>
				</div>
			{/if}
		</PancakeTreemap>
	</Pancake.Chart>
</div>

<style>
	.breadcrumbs {
		width: 100%;
		padding: 0.3rem 0.4rem;
		background-color: transparent;
		font-family: inherit;
		font-size: inherit;
		text-align: left;
		border: none;
		cursor: pointer;
		outline: none;
	}

	.breadcrumbs:disabled {
		cursor: default;
	}

	.chart {
		width: calc(100% + 2px);
		height: 900px;
		padding: 0;
		margin: 0 -1px 36px -1px;
		overflow: hidden;
	}

	.node {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: white;
		overflow: hidden;
		pointer-events: all;
		cursor: pointer;
	}

	.pancontents {
		width: 100%;
		height: 100%;
		padding: 0.3rem 0.4rem;
		border: 1px solid white;
		background-color: hsl(240, 8%, 70%);
		color: white;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.pancontents:hover {
		background-color: #F1EB9A;
		color: black;
	}

	.node:not(.leaf) .pancontents {
		background-color: hsl(240, 8%, 44%);
	}

	.node:not(.leaf) .pancontents:hover {
		background-color: #F1EB9A;
	}

	strong {
		display: block;
		font-size: 16px;
		white-space: nowrap;
		line-height: 1;
		text-decoration: underline;
	}


</style>