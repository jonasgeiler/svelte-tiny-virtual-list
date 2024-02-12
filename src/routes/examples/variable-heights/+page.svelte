<script>
	import VirtualList from '$lib/VirtualList.svelte';

	let virtualList;
	let rowHeights = [];

	randomize();

	function randomize() {
		let newRowHeights = [];

		for (let i = 0; i < 10000; i++) {
			newRowHeights.push(Math.random() * (
				155 - 50
			) + 50);
		}

		rowHeights = newRowHeights;
	}
</script>

<div class="actions">
	<button on:click={randomize} class="button">
		<svg viewBox="0 0 32 40" x="0px" y="0px" width="18">
			<path
				d="M26.125.219c-.075.037-.125.131-.125.281v2.5h-2.5c-1.1 0-1.996.371-2.75 1.125l-4.813 4.813 2.125 2.125 4.813-4.813.031-.031c.091-.061.5-.219.594-.219h2.5v2.5c0 .3.206.387.406.188l5.188-3.875c.2-.2.2-.425 0-.625l-5.188-3.875c-.1-.1-.206-.131-.281-.094zm-26.125 2.781v3h5.5c.1 0 .579.204.625.25l14.625 14.625c.754.754 1.65 1.125 2.75 1.125h2.5v2.5c0 .3.206.387.406.188l5.188-3.875c.2-.2.2-.425 0-.625l-5.188-3.875c-.2-.2-.406-.113-.406.188v2.5h-2.5c-.1 0-.579-.204-.625-.25l-14.625-14.625c-.754-.754-1.65-1.125-2.75-1.125h-5.5zm10.938 10.938l-4.813 4.813c.042-.042-.725.25-.625.25h-5.5v3h5.5c1.085 0 1.889-.279 2.719-1.094l.031-.031 4.813-4.813-2.125-2.125z"
				transform="translate(0 7)"
			></path>
		</svg>
		Randomize heights
	</button>
</div>

<div class="list">
	<VirtualList
		bind:this={virtualList}
		height={500}
		width="auto"
		itemCount={10000}
		itemSize={rowHeights}
	>
		<div slot="item" let:index let:style {style} class="row">
			Item #{index}
		</div>
	</VirtualList>
</div>

<style>
	:global(body), :global(html) {
		height           : 100%;
		margin           : 0;
		background-color : rgb(249, 249, 249);
	}

	:global(.virtual-list-wrapper) {
		margin                 : 20px;
		background             : #fff;
		border-radius          : 2px;
		box-shadow             : 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
		background             : #fafafa;
		font-family            : -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
		color                  : #333;
		-webkit-font-smoothing : antialiased;
	}

	.row {
		padding       : 0 15px;
		border-bottom : 1px solid #eee;
		box-sizing    : border-box;
		line-height   : 50px;
		font-weight   : 500;
		background    : #fff;
	}

	.actions {
		display          : -webkit-box;
		display          : -ms-flexbox;
		display          : flex;
		-ms-flex-wrap    : wrap;
		flex-wrap        : wrap;
		padding          : 0 20px;
		padding-top      : 15px;
		-webkit-box-pack : justify;
		-ms-flex-pack    : justify;
		justify-content  : space-between;
	}

	.actions .button {
		margin-bottom : 10px;
		margin-left   : auto;
	}

	.button {
		font-family         : -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
		display             : -webkit-box;
		display             : -ms-flexbox;
		display             : flex;
		-webkit-box-align   : center;
		-ms-flex-align      : center;
		align-items         : center;
		height              : 36px;
		padding             : 0 16px;
		background          : #fff;
		border-radius       : 3px;
		text-transform      : uppercase;
		font-weight         : 500;
		font-size           : 15px;
		color               : #111;
		background-color    : #fafafa;
		box-shadow          : 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
		cursor              : pointer;
		-webkit-user-select : none;
		-moz-user-select    : none;
		-ms-user-select     : none;
		user-select         : none;
	}

	.button:active {
		background-color : #f0f0f0;
	}

	.button svg {
		margin-right : 8px;
	}
</style>
