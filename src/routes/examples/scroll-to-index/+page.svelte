<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let virtualList;
	let rowHeights = $state.raw([]);

	let scrollToIndex = $state();
	let scrollToAlignment = $state('start');
	let scrollToBehaviour = $state('instant');

	const NUM_ROWS = 10000;

	function randomize() {
		const newRowHeights = [];

		for (let i = 0; i < NUM_ROWS; i++)
			newRowHeights.push(Math.random() * (155 - 50) + 50);

		rowHeights = newRowHeights;
	};

	randomize();
</script>

<svelte:head>
	<title>Scroll to index | svelte-tiny-virtual-list</title>
</svelte:head>

<div id="scroll-to-index-example" class="example-page">
	<h3>Scroll to index</h3>

	<div class="field label border">
		<input id="scroll-to-index" type="number" bind:value={scrollToIndex}/>
		<label for="scroll-to-index">Scroll to index...</label>
	</div>

	<div class="field label suffix border">
		<select id="alignment" bind:value={scrollToAlignment}>
			<option value="start">start</option>
			<option value="center">center</option>
			<option value="end">end</option>
			<option value="auto">auto</option>
		</select>
		<label for="alignment">Alignment</label>
		<i>arrow_drop_down</i>
	</div>

	<div class="field label suffix border">
		<select id="behaviour" bind:value={scrollToBehaviour}>
			<option value="auto">auto</option>
			<option value="smooth">smooth</option>
			<option value="instant">instant</option>
		</select>
		<label for="behaviour">Behaviour</label>
		<i>arrow_drop_down</i>
	</div>

	<article>
		<VirtualList
			bind:this={virtualList}
			height={500}
			width="auto"
			itemCount={10000}
			itemSize={(index) => rowHeights[index]}
			{scrollToIndex}
			{scrollToAlignment}
			{scrollToBehaviour}
		>
			{#snippet children({ style, index })}
				<div
					{style}
					class="virtual-list-row"
					class:highlighted={index === scrollToIndex}
				>
					Item #{index}
				</div>
			{/snippet}
		</VirtualList>
	</article>

	<!-- TODO: Show example code -->
</div>
