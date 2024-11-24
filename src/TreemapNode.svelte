<script>
	import TreemapNode from './TreemapNode.svelte';
	import * as Pancake from '@sveltejs/pancake';
	import { getContext } from 'svelte';

	let { node, children } = $props();
</script>

<Pancake.Box x1={node.x0} x2={node.x1} y1={node.y1} y2={node.y0}>
	{@render children?.({ node, })}
</Pancake.Box>

{#each (node.children || []) as child}
	<TreemapNode node={child} let:node>
		{@render children?.({ node, })}
	</TreemapNode>
{/each}