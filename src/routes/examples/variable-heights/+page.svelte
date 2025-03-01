<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let rowHeights = $state([]);

	randomize();

	function randomize() {
		let newRowHeights = [];

		for (let i = 0; i < 10000; i++) {
			newRowHeights.push(Math.random() * (155 - 50) + 50);
		}

		rowHeights = newRowHeights;
	}
</script>

<svelte:head>
	<title>Variable heights | svelte-tiny-virtual-list</title>
</svelte:head>

<div id="variable-heights-example" class="example-page">
	<h3>Variable heights</h3>

	<button class="responsive margin" on:click={randomize}>
		<i aria-hidden="true">shuffle</i>
		<span>Randomize heights</span>
	</button>

	<article>
		<VirtualList
			height={500}
			width="auto"
			itemCount={10000}
			itemSize={rowHeights}
		>
			{#snippet children({ style, index })}
				<div {style} class="virtual-list-row">
					Item #{index}
				</div>
			{/snippet}
		</VirtualList>
	</article>

	<!-- TODO: Show example code -->
</div>
