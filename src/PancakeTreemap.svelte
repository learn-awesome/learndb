<script>
	import TreemapNode from './TreemapNode.svelte';

	let { root, children } = $props();

	const children_render = $derived(children);
</script>

<pancake-treemap>
	<TreemapNode node={root} >
		{#snippet children({ node })}
				{@render children_render?.({ node, })}
					{/snippet}
		</TreemapNode>
</pancake-treemap>

<style>
	pancake-treemap {
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>