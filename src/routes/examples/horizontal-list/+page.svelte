<script>
	import VirtualList from '$lib/VirtualList.svelte';
</script>

<div class="list horizontal">
	<VirtualList
		height="200px"
		width={680}
		scrollDirection="horizontal"
		itemCount={100000}
		itemSize={150}>
		<div slot="item" let:index let:style {style} class="col">
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

	.col {
		padding      : 0 15px;
		padding-top  : 30px;
		border-right : 1px solid #eee;
		box-sizing   : border-box;
		line-height  : 50px;
		font-weight  : 500;
		text-align   : center;
		background   : #fff;
	}

	.horizontal {
		margin : 50px auto;
	}
</style>
