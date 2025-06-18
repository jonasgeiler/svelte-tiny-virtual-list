import type { Snippet, Component } from "svelte";

export type Alignment = 'auto' | 'start' | 'center' | 'end';
export type ScrollBehaviour = 'auto' | 'smooth' | 'instant';

export type Direction = 'horizontal' | 'vertical';

export type ItemSizeGetter = (index: number) => number;
export type ItemSize = number | number[] | ItemSizeGetter;

/**
 * VirtualList props
 */
export interface VirtualListProps {
	/**
	 * Width of List. This property will determine the number of rendered items when scrollDirection is `'horizontal'`.
	 *
	 * @default '100%'
	 */
	width?: number | string;

	/**
	 * Height of List. This property will determine the number of rendered items when scrollDirection is `'vertical'`.
	 */
	height: number | string;

	/**
	 * The number of items you want to render
	 */
	itemCount: number;

	/**
	 * Either a fixed height/width (depending on the scrollDirection),
	 * an array containing the heights of all the items in your list,
	 * or a function that returns the height of an item given its index: `(index: number): number`
	 */
	itemSize: ItemSize;

	/**
	 * Whether the list should scroll vertically or horizontally. One of `'vertical'` (default) or `'horizontal'`.
	 *
	 * @default 'vertical'
	 */
	scrollDirection?: Direction;

	/**
	 * Can be used to control the scroll offset; Also useful for setting an initial scroll offset
	 */
	scrollOffset?: number;

	/**
	 * Item index to scroll to (by forcefully scrolling if necessary)
	 */
	scrollToIndex?: number;

	/**
	 * Used in combination with `scrollToIndex`, this prop controls the alignment of the scrolled to item.
	 * One of: `'start'`, `'center'`, `'end'` or `'auto'`.
	 * Use `'start'` to always align items to the top of the container and `'end'` to align them bottom.
	 * Use `'center'` to align them in the middle of the container.
	 * `'auto'` scrolls the least amount possible to ensure that the specified `scrollToIndex` item is fully visible.
	 */
	scrollToAlignment?: Alignment;

	/**
	 * Used in combination with `scrollToIndex`, this prop controls the behaviour of the scrolling.
	 * One of: `'auto'`, `'smooth'` or `'instant'` (default).
	 */
	scrollToBehaviour?: ScrollBehaviour;

	/**
	 * An array of indexes (eg. `[0, 10, 25, 30]`) to make certain items in the list sticky (`position: sticky`)
	 */
	stickyIndices?: number[];

	/**
	 * Number of extra buffer items to render above/below the visible items.
	 * Tweaking this can help reduce scroll flickering on certain browsers/devices.
	 *
	 * @default 3
	 */
	overscanCount?: number;

	/**
	 * Used to estimate the total size of the list before all of its items have actually been measured.
	 * The estimated total height is progressively adjusted as items are rendered.
	 */
	estimatedItemSize?: number;

	/**
	 * Function that returns the key of an item in the list, which is used to uniquely identify an item.
	 * This is useful for dynamic data coming from a database or similar.
	 * By default, it's using the item's index.
	 *
	 * @param index - The index of the item.
	 * @return - Anything that uniquely identifies the item.
	 */
	getKey?: (index: number) => any;

	/** Called when visible items range updates */
	onListItemsUpdate?: (obj: { start: number, end: number }) => any;

	/** Called after scroll */
	onAfterScroll?: (obj: { offset: number, event: Event }) => any;

	/**
	 * Snippet to render a list item.
	 * Called like: `children({ index, style })`
	 */
	children: Snippet<[{ index: number; style: string }]>;

	/** Optional header snippet — used like `{@render header()}` */
	header?: Snippet;

	/** Optional footer snippet — used like `{@render footer()}` */
	footer?: Snippet;
}

export interface ItemsUpdatedDetail {
	start: number;
	end: number;
}

/**
 * VirtualList component
 */
declare const VirtualList: Component<VirtualListProps>;
export default VirtualList;
