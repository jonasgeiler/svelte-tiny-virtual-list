<div class="container">
	<h1>svelte-tiny-virtual-list</h1>

	<h2>Examples</h2>
	<ul>
		<li>
			<a href="/examples/elements-of-equal-height">Elements of equal height</a>
		</li>
		<li>
			<a href="/examples/variable-heights">Variable heights</a>
		</li>
		<li>
			<a href="/examples/horizontal-list">Horizontal list</a>
		</li>
		<li>
			<a href="/examples/scroll-to-index">Scroll to index</a>
		</li>
		<li>
			<a href="/examples/controlled-scroll-offset">Controlled scroll offset</a>
		</li>
	</ul>

	<h2>Demos</h2>
	<ul>
		<li>
			<a href="/demos/hacker-news">Hacker News</a>
		</li>
	</ul>
</div>

<style>
	:global(body),
	:global(html) {
		height: 100%;
		margin: 0;
		background-color: rgb(249, 249, 249);
		font-family: -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
		color: #333;
		-webkit-font-smoothing: antialiased;
	}

	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
	}

	:global(input::-moz-focus-inner),
	:global(input::-moz-focus-outer) {
		border: 0;
	}
</style>
