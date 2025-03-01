<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let width = $state(1);
</script>

<svelte:head>
	<title>Horizontal list | svelte-tiny-virtual-list</title>
</svelte:head>

<div id="horizontal-list-example" class="example-page">
	<h3>Horizontal list</h3>

	<article>
		<div bind:clientWidth={width} class="row scroll">
			<VirtualList
				height="200px"
				{width}
				scrollDirection="horizontal"
				itemCount={100000}
				itemSize={150}
			>
				{#snippet children({ style, index })}
					<div {style} class="virtual-list-col">
						Item #{index}
					</div>
				{/snippet}
			</VirtualList>
		</div>
	</article>

	<!-- TODO: Show example code -->
</div>
