<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let width = 1;
</script>

<svelte:head>
	<title>Horizontal list | svelte-tiny-virtual-list</title>
</svelte:head>

<div class="example" id="horizontal-list-example">
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
				<div slot="item" let:index let:style {style} class="col">
					Item #{index}
				</div>
			</VirtualList>
		</div>
	</article>
</div>
