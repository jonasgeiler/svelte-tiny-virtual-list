<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let rowHeights = [];

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

<div class="example" id="variable-heights-example">
	<h3>Variable heights</h3>

	<button class="responsive margin" on:click={randomize}>
		<i aria-hidden="true">shuffle</i>
		<span>Randomize heights</span>
	</button>

	<article>
		<VirtualList height={500} width="auto" itemCount={10000} itemSize={rowHeights}>
			<div slot="item" let:index let:style {style} class="row">
				Item #{index}
			</div>
		</VirtualList>
	</article>
</div>
