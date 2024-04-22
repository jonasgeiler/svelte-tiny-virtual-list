<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let itemSize = 50;
</script>

<svelte:head>
	<title>Elements of equal height | svelte-tiny-virtual-list</title>
</svelte:head>

<div class="example" id="elements-of-equal-height-example">
	<h3>Elements of equal height</h3>

	<div class="range-field">
		<label for="item-size">Item size</label>
		<div class="slider">
			<input id="item-size" type="range" step="5" min="50" max="155" bind:value={itemSize} />
			<span></span>
		</div>
	</div>

	<article>
		<VirtualList height={500} width="auto" itemCount={100000} {itemSize}>
			<div slot="item" let:index let:style {style} class="row">
				Item #{index}
			</div>
		</VirtualList>
	</article>
</div>
