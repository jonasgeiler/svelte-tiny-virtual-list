<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let itemSize = 50;
</script>

<div class="actions">
	<label for="item-height">
		Item Height:

		<div class="range">
			<input type="range" id="item-height" step="5" min="50" max="155" bind:value={itemSize}>
		</div>
	</label>
</div>

<div class="list">
	<VirtualList
		height={500}
		width="auto"
		itemCount={100000}
		{itemSize}>
		<div slot="item" let:index let:style {style} class="row">
			Item #{index}
		</div>
	</VirtualList>
</div>

<style>
	:global(body), :global(html) {
		height: 100%;
		margin: 0;
		background-color: rgb(249, 249, 249);
	}

	:global(.virtual-list-wrapper) {
		margin: 20px;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
		background: #fafafa;
		font-family: -apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;
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

	.actions label {
		padding: 10px 0;
		font-size: 18px;
		color: #999;
		font-family: -apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;
	}

	.range {
		position: relative;
		top: -1px;
		display: inline-block;
		margin-left: 15px;
		width: 250px;
	}

	:global(input[type=range]) {
		-webkit-appearance: none;
		width: 100%;
		height: 10px;
		border-radius: 5px;
		background: #d7dcdf;
		outline: none;
		padding: 0;
		margin: 0;
	}

	:global(input[type=range]), :global(input[type=range]) *, :global(input[type=range]:after), :global(input[type=range]:before) {
		box-sizing: border-box;
	}

	:global(input[type=range]::-webkit-slider-thumb) {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #2c3e50;
		cursor: pointer;
		transition: background .15s ease-in-out;
	}

	:global(input[type=range]::-webkit-slider-thumb:hover), :global(input[type=range]:active::-webkit-slider-thumb) {
		background: #008cff;
	}

	:global(input[type=range]::-moz-range-thumb) {
		width: 20px;
		height: 20px;
		border: 0;
		border-radius: 50%;
		background: #2c3e50;
		cursor: pointer;
		transition: background .15s ease-in-out;
	}

	:global(input[type=range]::-moz-range-thumb:hover), :global(input[type=range]:active::-moz-range-thumb) {
		background: #008cff;
	}

	:global(::-moz-range-track) {
		background: #d7dcdf;
		border: 0;
	}

	:global(input::-moz-focus-inner), :global(input::-moz-focus-outer) {
		border: 0;
	}
</style>
