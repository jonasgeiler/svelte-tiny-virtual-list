/// <reference types="svelte" />
import { SvelteComponent } from 'svelte';

export type Alignment = "auto" | "start" | "center" | "end";
export type ScrollBehaviour = "auto" | "smooth" | "instant";

export type Direction = "horizontal" | "vertical";

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
	 * 
	 * @default '100%'
	 */
	height: number | string;

	/**
	 * The number of items you want to render
	 * 
	 * @default 0
	 */
	itemCount: number;

	/**
	 * Either a fixed height/width (depending on the scrollDirection),
	 * an array containing the heights of all the items in your list,
	 * or a function that returns the height of an item given its index: `(index: number): number`
	 * 
	 * @default 0
	 */
	itemSize: ItemSize;

	/**
	 * Whether the list should scroll vertically or horizontally. One of `'vertical'` or `'horizontal'`.
	 *
	 * @default 'vertical'
	 */
	scrollDirection?: Direction;

	/**
	 * Can be used to control the scroll offset; Also useful for setting an initial scroll offset
	 * 
	 * @default 0
	 */
	scrollOffset?: number;

	/**
	 * Item index to scroll to (by forcefully scrolling if necessary)
	 * 
	 * @default -1
	 */
	scrollToIndex?: number;

	/**
	 * Used in combination with `scrollToIndex`, this prop controls the alignment of the scrolled to item.
	 * One of: `'start'`, `'center'`, `'end'` or `'auto'`.
	 * Use `'start'` to always align items to the top of the container and `'end'` to align them bottom.
	 * Use `'center'` to align them in the middle of the container.
	 * `'auto'` scrolls the least amount possible to ensure that the specified `scrollToIndex` item is fully visible.
	 * 
	 * @default 'start'
	 */
	scrollToAlignment?: Alignment;

	/**
	 * Used in combination with `scrollToIndex`, this prop controls the behaviour of the scrolling.
	 * One of: `'auto'`, `'smooth'` or `'instant'`.
	 * 
	 * @default 'instant'
	 */
	scrollToBehaviour?: ScrollBehaviour;

	/**
	 * An array of indexes (eg. `[0, 10, 25, 30]`) to make certain items in the list sticky (`position: sticky`)
	 * 
	 * @default []
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
	 * 
	 * @default 0
	 */
	estimatedItemSize?: number;

	/**
	 * Function that returns the key of an item in the list, which is used to uniquely identify an item.
	 * This is useful for dynamic data coming from a database or similar.
	 * By default, it's using the item's index.
	 * 
	 * @default null
	 *
	 * @param index - The index of the item.
	 * @return - Anything that uniquely identifies the item.
	 */
	getKey?: (index: number) => any;

    /**
	 * @default function
	 * 
     * @param object
     */
    onListItemsUpdate?: (object: ItemsUpdatedParams) => any,

    /**
	 * @default function
	 * 
     * @param object
     */
    onAfterScroll?: (object: AfterScrollParams) => any

	/**
	 * Classes for the list container
	 * 
	 * @default '''
	 */
	dangerously_set_classes_container: string;

	/**
	 * Classes for the list inner container
	 * 
	 * @default '''
	 */
	dangerously_set_classes_inner_container: string;
}


/**
 * VirtualList children
 * TODO: check type for snippets: https://svelte-5-preview.vercel.app/docs/snippets
 */
export interface VirtualListChildren {
	/**
	 * Snippet for each item
	 */
	item: (object: VirtualListRowParams) => SvelteComponent;

	/**
	 * Snippet for the elements that should appear at the top of the list
	 */
	header?: () => SvelteComponent;

	/**
	 * Snippet for the elements that should appear at the bottom of the list
	 */
	footer?: () => SvelteComponent;
}

export interface VirtualListRowParams {
    /**
     * Item index
     */
    index: number,

    /**
     * Item style, must be applied to the snippet (look above for example)
     */
    style: string
}


export interface ItemsUpdatedParams {
	/**
	 * Index of the first visible item
	 */
	start: number;

	/**
	 * Index of the last visible item
	 */
	end: number;
}


export interface AfterScrollParams {
	/**
	 * The original scroll event
	 */
	event: Event;

	/**
	 * Either the value of `wrapper.scrollTop` or `wrapper.scrollLeft`
	 */
	offset: number;
}


/**
 * VirtualList component
 */
export default class VirtualList extends SvelteComponent<VirtualListProps, VirtualListChildren> {
}