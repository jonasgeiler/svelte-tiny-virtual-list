<p align="center"><img src="./static/logo.svg" alt="Logo" width="225"></p>
<h2 align="center">svelte-tiny-virtual-list</h2>
<p align="center">A tiny but mighty list virtualization library, with zero dependencies &#128170;</p>
<p align="center">
  <a href="https://npmjs.com/package/svelte-tiny-virtual-list"><img src="https://img.shields.io/npm/v/svelte-tiny-virtual-list?style=for-the-badge" alt="NPM VERSION"></a>
  <a href="https://npmjs.com/package/svelte-tiny-virtual-list"><img src="https://img.shields.io/npm/dt/svelte-tiny-virtual-list?style=for-the-badge" alt="NPM DOWNLOADS"></a>
  <a href="https://npmjs.com/package/svelte-tiny-virtual-list"><img src="https://img.shields.io/librariesio/release/npm/svelte-tiny-virtual-list?style=for-the-badge" alt="DEPENDENCIES"></a>
</p>
<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#examples--demo">Examples</a> •
  <a href="#license">License</a>
</p>

## About

Instead of rendering all your data in a huge list, the virtual list component just renders the items that are visible, keeping your page nice and light.  
This is heavily inspired by [react-tiny-virtual-list](https://github.com/clauderic/react-tiny-virtual-list) and uses most of its code and functionality!

### Features

- **Tiny & dependency free** – Only ~5kb gzipped
- **Render millions of items**, without breaking a sweat
- **Scroll to index** or **set the initial scroll offset**
- **Supports fixed** or **variable** heights/widths
- **Vertical** or **Horizontal** lists
- [`svelte-infinite-loading`](https://github.com/Skayo/svelte-infinite-loading) compatibility

## Installation

> If you're using this component in a Sapper application, make sure to install the package to `devDependencies`!  
> [More Details](https://github.com/sveltejs/sapper-template#using-external-components)

With npm:

```shell
$ npm install svelte-tiny-virtual-list
```

With yarn:

```shell
$ yarn add svelte-tiny-virtual-list
```

With [pnpm](https://pnpm.js.org/) (recommended):

```shell
$ npm i -g pnpm
$ pnpm install svelte-tiny-virtual-list
```

From CDN (via [unpkg](https://unpkg.com/)):

```html
<!-- UMD -->
<script src="https://unpkg.com/svelte-tiny-virtual-list@^1/dist/svelte-tiny-virtual-list.js"></script>

<!-- ES Module -->
<script src="https://unpkg.com/svelte-tiny-virtual-list@^1/dist/svelte-tiny-virtual-list.mjs"></script>
```

## Usage

```svelte
<script>
	import VirtualList from 'svelte-tiny-virtual-list';

	const data = ['A', 'B', 'C', 'D', 'E', 'F' /* ... */];
</script>

<VirtualList width="100%" height={600} itemCount={data.length} itemSize={50}>
	{#snippet children({ style, index })}
		<div {style}>
			Letter: {data[index]}, Row: #{index}
		</div>
	{/snippet}
</VirtualList>
```

Also works pretty well with [`svelte-infinite-loading`](https://github.com/Skayo/svelte-infinite-loading):

```svelte
<script>
	import VirtualList from 'svelte-tiny-virtual-list';
	import InfiniteLoading from 'svelte-infinite-loading';

	let data = $state(['A', 'B', 'C', 'D', 'E', 'F' /* ... */]);

	function infiniteHandler({ detail: { complete, error } }) {
		try {
			// Normally you'd make an http request here...

			const newData = ['G', 'H', 'I', 'J', 'K', 'L' /* ... */];

			data = [...data, ...newData];
			complete();
		} catch (e) {
			error();
		}
	}
</script>

<VirtualList width="100%" height={600} itemCount={data.length} itemSize={50}>
	{#snippet children({ style, index })}
		<div {style}>
			Letter: {data[index]}, Row: #{index}
		</div>
	{/snippet}

	{#snippet footer()}
		<div>
			<InfiniteLoading on:infinite={infiniteHandler} />
		</div>
	{/snippet}
</VirtualList>
```

### Props

| Property          | Type                                              | Required? | Description                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------- | :-------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| width             | `number \| string`\*                              |     ✓     | Width of List. This property will determine the number of rendered items when scrollDirection is `'horizontal'`.                                                                                                                                                                                                                                                                                                                      |
| height            | `number \| string`\*                              |     ✓     | Height of List. This property will determine the number of rendered items when scrollDirection is `'vertical'`.                                                                                                                                                                                                                                                                                                                       |
| itemCount         | `number`                                          |     ✓     | The number of items you want to render                                                                                                                                                                                                                                                                                                                                                                                                |
| itemSize          | `number \| number[] \| (index: number) => number` |     ✓     | Either a fixed height/width (depending on the scrollDirection), an array containing the heights of all the items in your list, or a function that returns the height of an item given its index: `(index: number): number`                                                                                                                                                                                                            |
| scrollDirection   | `string`                                          |           | Whether the list should scroll vertically or horizontally. One of `'vertical'` (default) or `'horizontal'`.                                                                                                                                                                                                                                                                                                                           |
| scrollOffset      | `number`                                          |           | Can be used to control the scroll offset; Also useful for setting an initial scroll offset                                                                                                                                                                                                                                                                                                                                            |
| scrollToIndex     | `number`                                          |           | Item index to scroll to (by forcefully scrolling if necessary)                                                                                                                                                                                                                                                                                                                                                                        |
| scrollToAlignment | `string`                                          |           | Used in combination with `scrollToIndex`, this prop controls the alignment of the scrolled to item. One of: `'start'`, `'center'`, `'end'` or `'auto'`. Use `'start'` to always align items to the top of the container and `'end'` to align them bottom. Use `'center`' to align them in the middle of the container. `'auto'` scrolls the least amount possible to ensure that the specified `scrollToIndex` item is fully visible. |
| scrollToBehaviour | `string`                                          |           | Used in combination with `scrollToIndex`, this prop controls the behaviour of the scrolling. One of: `'auto'`, `'smooth'` or `'instant'` (default).                                                                                                                                                                                                                                                                                   |
| stickyIndices     | `number[]`                                        |           | An array of indexes (eg. `[0, 10, 25, 30]`) to make certain items in the list sticky (`position: sticky`)                                                                                                                                                                                                                                                                                                                             |
| overscanCount     | `number`                                          |           | Number of extra buffer items to render above/below the visible items. Tweaking this can help reduce scroll flickering on certain browsers/devices.                                                                                                                                                                                                                                                                                    |
| estimatedItemSize | `number`                                          |           | Used to estimate the total size of the list before all of its items have actually been measured. The estimated total height is progressively adjusted as items are rendered.                                                                                                                                                                                                                                                          |
| getKey            | `(index: number) => any`                          |           | Function that returns the key of an item in the list, which is used to uniquely identify an item. This is useful for dynamic data coming from a database or similar. By default, it's using the item's index.           
| onAfterScroll     | `({ event: ScrollEvent, offset: number }) => any`                          |           | Function that fires after handling the scroll event. Props: `event: ScrollEvent` - The original scroll event, `offset: number` - Either the value of `wrapper.scrollTop` or `wrapper.scrollLeft`
| onListItemsUpdate | `({ start: number, end: number }) => any`                          |           | Function that fires when the visible items are updated. Props: `start: number` - Index of the first visible item, `end: number` - Index of the last visible item.                                                                                                                                                                                         |

_\* `height` must be a number when `scrollDirection` is `'vertical'`. Similarly, `width` must be a number if `scrollDirection` is `'horizontal'`_

### Snippets

- `children` - Snippet for each item
  - Prop: `{ index, style }`
    - `index: number` - Item index
    - `style: string` - Item style, must be applied to the snippet (look above for example)
- `header` - Snippet for the elements that should appear at the top of the list
- `footer` - Snippet for the elements that should appear at the bottom of the list (e.g. `InfiniteLoading` component from `svelte-infinite-loading`)

### Methods

- `recomputeSizes(startIndex: number)` - This method force recomputes the item sizes after the specified index (these are normally cached).

`VirtualList` has no way of knowing when its underlying data has changed, since it only receives a itemSize property. If the itemSize is a `number`, this isn't an issue, as it can compare before and after values and automatically call `recomputeSizes` internally.
However, if you're passing a function to `itemSize`, that type of comparison is error prone. In that event, you'll need to call `recomputeSizes` manually to inform the `VirtualList` that the size of its items has changed.

#### Use the methods like this:

```svelte
<script>
	import { onMount } from 'svelte';
	import VirtualList from 'svelte-tiny-virtual-list';

	const data = ['A', 'B', 'C', 'D', 'E', 'F' /* ... */];

	let virtualList;

	function handleClick() {
		virtualList.recomputeSizes(0);
	}
</script>

<button on:click={handleClick}>Recompute Sizes</button>

<VirtualList
	bind:this={virtualList}
	width="100%"
	height={600}
	itemCount={data.length}
	itemSize={50}
>
	{#snippet children({ style, index })}
		<div {style}>
			Letter: {data[index]}, Row: #{index}
		</div>
	{/snippet}
</VirtualList>
```

### Styling

You can style the elements of the virtual list like this:

```svelte
<script>
	import VirtualList from 'svelte-tiny-virtual-list';

	const data = ['A', 'B', 'C', 'D', 'E', 'F' /* ... */];
</script>

<div class="list">
	<VirtualList width="100%" height={600} itemCount={data.length} itemSize={50}>
		{#snippet children({ style, index })}
			<div {style}>
				Letter: {data[index]}, Row: #{index}
			</div>
		{/snippet}
	</VirtualList>
</div>

<style>
	.list :global(.virtual-list-wrapper) {
		background-color: #0f0;
		/* ... */
	}

	.list :global(.virtual-list-inner) {
		background-color: #f00;
		/* ... */
	}
</style>
```

## Examples / Demo

- **Basic setup**
  - [Elements of equal height](https://svelte.dev/repl/e3811b44f311461dbbc7c2df830cde68)
  - [Variable heights](https://svelte.dev/repl/93795c812f8d4541b6b942535b2ed855)
  - [Horizontal list](https://svelte.dev/repl/4cd8acdfc96843b68265a19451b1bf3d)
- **Controlled props**
  - [Scroll to index](https://svelte.dev/repl/bdf5ceb63f6e45f7bb14b90dbd2c11d9)
  - [Controlled scroll offset](https://svelte.dev/repl/68576a3919c44033a74416d4bc4fde7e)
- [Hacker News using svelte-infinite-loading](https://svelte.dev/repl/2239cc4c861c41d18abbc858248f5a0d)

## License

[MIT License](https://github.com/Skayo/svelte-tiny-virtual-list/blob/master/LICENSE)
