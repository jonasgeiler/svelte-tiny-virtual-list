<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let virtualList;
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

<div class="actions">
	<input type="number" placeholder="Scroll to offset..." class="input" bind:value={scrollOffset} />
</div>

<div class="list">
	<VirtualList
		bind:this={virtualList}
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
</div>

<style>
	:global(body),
	:global(html) {
		height: 100%;
		margin: 0;
		background-color: rgb(249, 249, 249);
	}

	:global(.virtual-list-wrapper) {
		margin: 20px;
		background: #fff;
		border-radius: 2px;
		box-shadow:
			0 2px 2px 0 rgba(0, 0, 0, 0.14),
			0 3px 1px -2px rgba(0, 0, 0, 0.2),
			0 1px 5px 0 rgba(0, 0, 0, 0.12);
		background: #fafafa;
		font-family: -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
		color: #333;
		-webkit-font-smoothing: antialiased;
	}

	.row {
		padding: 0 15px;
		border-bottom: 1px solid #eee;
		box-sizing: border-box;
		line-height: 50px;
		font-weight: 500;
		background: #fff;
	}

	.actions {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		padding: 0 20px;
		padding-top: 15px;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		justify-content: space-between;
	}

	.input {
		color: #333 !important;
		font-size: 18px;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border: none;
		border-bottom: 1px solid #ddd;
		background-color: transparent;
		padding: 10px 0;
		margin-bottom: 10px;
		font-family: -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
		outline: none;
	}

	.input:focus {
		border-bottom: 2px solid #008cff;
		margin-bottom: 9px;
	}

	:global(input::-moz-focus-inner),
	:global(input::-moz-focus-outer) {
		border: 0;
	}
</style>
