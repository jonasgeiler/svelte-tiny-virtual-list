<p align="center"><img src="https://raw.githubusercontent.com/Skayo/svelte-tiny-virtual-list/master/assets/ListLogo.svg" alt="ListLogo" width="225"></p>
<h2 align="center">svelte-tiny-virtual-list</h2>
<p align="center">An infinite scroll component for Svelte apps</p>
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

A tiny but mighty list virtualization library, with zero dependencies 💪  
This is heavily inspired by [react-tiny-virtual-list](https://github.com/clauderic/react-tiny-virtual-list) and uses most of its code and functionality!

### Features

- **Tiny & dependency free** – Only 3kb gzipped
- **Render millions of items**, without breaking a sweat
- **Scroll to index** or **set the initial scroll offset**
- **Supports fixed** or **variable** heights/widths
- **Vertical** or **Horizontal** lists

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

  const data = ['A', 'B', 'C', 'D', 'E', 'F', /* ... */];
</script>

<VirtualList
    width="100%"
    height={600}
    itemCount={data.length}
    itemSize={50}>
  <div slot="item" let:index let:style {style}>
    Letter: {data[index]}, Row: #{index}
  </div>
</VirtualList>
```

Also works pretty well with [`svelte-infinite-loading`](https://github.com/Skayo/svelte-infinite-loading):

```svelte
<script>
  import VirtualList from 'svelte-tiny-virtual-list';
  import InfiniteLoading from 'svelte-infinite-loading';

  let data = ['A', 'B', 'C', 'D', 'E', 'F', /* ... */];

  function infiniteHandler({ detail: { complete, error } }) {
    try {
      // Normally you'd make an http request here...

      const newData = ['G', 'H', 'I', 'J', 'K', 'L', /* ... */];
      
      data = [...data, ...newData];
      complete();
    } catch (e) {
      error();
    }
  }
</script>

<VirtualList
    width="100%"
    height={600}
    itemCount={data.length}
    itemSize={50}>
  <div slot="item" let:index let:style {style}>
    Letter: {data[index]}, Row: #{index}
  </div>

  <div slot="footer">
    <InfiniteLoading on:infinite={infiniteHandler} />
  </div>
</VirtualList>
```

### Props

| Property          | Type               | Required? | Description                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :---------------- | :----------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| width             | Number \| String\* | ✓         | Width of List. This property will determine the number of rendered items when scrollDirection is `'horizontal'`.                                                                                                                                                                                                                                                                                                                      |
| height            | Number \| String\* | ✓         | Height of List. This property will determine the number of rendered items when scrollDirection is `'vertical'`.                                                                                                                                                                                                                                                                                                                       |
| itemCount         | Number             | ✓         | The number of items you want to render                                                                                                                                                                                                                                                                                                                                                                                                |
| itemSize          |                    | ✓         | Either a fixed height/width (depending on the scrollDirection), an array containing the heights of all the items in your list, or a function that returns the height of an item given its index: `(index: number): number`                                                                                                                                                                                                            |
| scrollDirection   | String             |           | Whether the list should scroll vertically or horizontally. One of `'vertical'` (default) or `'horizontal'`.                                                                                                                                                                                                                                                                                                                           |
| scrollOffset      | Number             |           | Can be used to control the scroll offset; Also useful for setting an initial scroll offset                                                                                                                                                                                                                                                                                                                                            |
| scrollToIndex     | Number             |           | Item index to scroll to (by forcefully scrolling if necessary)                                                                                                                                                                                                                                                                                                                                                                      |
| scrollToAlignment | String             |           | Used in combination with `scrollToIndex`, this prop controls the alignment of the scrolled to item. One of: `'start'`, `'center'`, `'end'` or `'auto'`. Use `'start'` to always align items to the top of the container and `'end'` to align them bottom. Use `'center`' to align them in the middle of the container. `'auto'` scrolls the least amount possible to ensure that the specified `scrollToIndex` item is fully visible. |
| stickyIndices     | Number[]           |           | An array of indexes (eg. `[0, 10, 25, 30]`) to make certain items in the list sticky (`position: sticky`)                                                                                                                                                                                                                                                                                                                             |
| overscanCount     | Number             |           | Number of extra buffer items to render above/below the visible items. Tweaking this can help reduce scroll flickering on certain browsers/devices.                                                                                                                                                                                                                                                                                    |
| estimatedItemSize | Number             |           | Used to estimate the total size of the list before all of its items have actually been measured. The estimated total height is progressively adjusted as items are rendered.                                                                                                                                                                                                                                                          |

_\* `height` must be a number when `scrollDirection` is `'vertical'`. Similarly, `width` must be a number if `scrollDirection` is `'horizontal'`_

### Slots

- `item` - Slot for each item
  - Props:
    - `index: number` - Item index
    - `style: string` - Item style, must be applied to the slot (look above for example)
- `header` - Slot for the elements that should appear at the top of the list
- `footer` - Slot for the elements that should appear at the bottom of the list (e.g. `InfiniteLoading` component from `svelte-infinite-loading`)

### Events

- `afterScroll` - Fired after handling the scroll event
  - `detail` Props:
    - `event: ScrollEvent` - The original scroll event
    - `offset: number` - Either the value of `rootNode.scrollTop` or `rootNode.scrollLeft`
- `itemsUpdated` - Fired when the visible items are updated
  - `detail` Props:
    - `start: number` - Index of the first visible item
    - `end: number` - Index of the last visible item
  
### Methods

- `recomputeSizes(startIndex: number)` - This method force recomputes the item sizes after the specified index (these are normally cached).
- `refresh()` - This method refreshes the currently visible items.

`VirtualList` has no way of knowing when its underlying data has changed, since it only receives a itemSize property. If the itemSize is a `number`, this isn't an issue, as it can compare before and after values and automatically call `recomputeSizes` internally.
However, if you're passing a function to `itemSize`, that type of comparison is error prone. In that event, you'll need to call `recomputeSizes` manually to inform the `VirtualList` that the size of its items has changed.

#### Use the methods like this:

```svelte
<script>
  import { onMount } from 'svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  const data = ['A', 'B', 'C', 'D', 'E', 'F', /* ... */];
  
  let virtualList;
  let recomputeSizes;
  
  onMount(() => {
    recomputeSizes = virtualList.recomputeSizes;
  })
</script>

<button on:click={() => recomputeSizes(4)}>Recompute Sizes</button>

<VirtualList
        bind:this={virtualList}
        width="100%"
        height={600}
        itemCount={data.length}
        itemSize={50}>
  <div slot="item" let:index let:style {style}>
    Letter: {data[index]}, Row: #{index}
  </div>
</VirtualList>
```

### Styling

You can style the elements of the virtual list like this:

```svelte
<script>
  import VirtualList from 'svelte-tiny-virtual-list';

  const data = ['A', 'B', 'C', 'D', 'E', 'F', /* ... */];
</script>

<div class="list">
  <VirtualList
      width="100%"
      height={600}
      itemCount={data.length}
      itemSize={50}>
    <div slot="item" let:index let:style {style}>
      Letter: {data[index]}, Row: #{index}
    </div>
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
    - [Elements of equal height](https://svelte.dev/repl/c053fb0b13154b07a503ac04e0cb2c66)
    - [Variable heights](https://svelte.dev/repl/73d404d5a26a47db969c4ebc154e8079)
    - [Horizontal list](https://svelte.dev/repl/9a04b19fcf5f4da0bead27f1cdf55cfb)
- **Controlled props**
    - [Scroll to index](https://svelte.dev/repl/9a04b19fcf5f4da0bead27f1cdf55cfb)
    - [Controlled scroll offset](https://svelte.dev/repl/9a04b19fcf5f4da0bead27f1cdf55cfb)

## License

[MIT License](https://github.com/Skayo/svelte-tiny-virtual-list/blob/master/LICENSE)
