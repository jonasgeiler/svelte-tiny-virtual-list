<script>
	import VirtualList from './VirtualList.svelte';

	let { data = [], scrollOffset, onItemRender = () => {} } = $props();
</script>

<div style="height: 400px; width: 400px;">
	<VirtualList height="200px" width="300px" itemCount={data.length} itemSize={50} {scrollOffset}>
		{#snippet item({ index, style })}
			{(onItemRender(index), '')}
			<div {style}>{data[index]?.label}</div>
		{/snippet}
	</VirtualList>
</div>
