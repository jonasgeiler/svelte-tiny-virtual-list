<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let rowHeights = [];

	let scrollOffset;

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
	<title>Controlled scroll offset | svelte-tiny-virtual-list</title>
</svelte:head>

<div class="example" id="controlled-scroll-offset-example">
	<h3>Controlled scroll offset</h3>

	<div class="field label border">
		<input id="scroll-offset" type="number" bind:value={scrollOffset} />
		<label for="scroll-offset">Scroll to offset...</label>
	</div>

	<article>
		<VirtualList
			height={500}
			width="auto"
			itemCount={10000}
			itemSize={(index) => rowHeights[index]}
			{scrollOffset}
		>
			<div slot="item" let:index let:style {style} class="row">
				Item #{index}
			</div>
		</VirtualList>
	</article>
</div>
