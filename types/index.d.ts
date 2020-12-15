/// <reference types="svelte" />
import { SvelteComponentTyped } from 'svelte';

export enum ALIGNMENT {
	AUTO = 'auto',
	START = 'start',
	CENTER = 'center',
	END = 'end',
}

export enum DIRECTION {
	HORIZONTAL = 'horizontal',
	VERTICAL = 'vertical',
}

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
	scrollDirection?: DIRECTION;

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
	 * Use `'center`' to align them in the middle of the container.
	 * `'auto'` scrolls the least amount possible to ensure that the specified `scrollToIndex` item is fully visible.
	 */
	scrollToAlignment?: ALIGNMENT;

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
}


/**
 * VirtualList slots
 */
export interface VirtualListSlots {
	/**
	 * Slot for each item
	 */
	item: {
		/**
		 * Item index
		 */
		index: number,

		/**
		 * Item style, must be applied to the slot (look above for example)
		 */
		style: string
	};

	/**
	 * Slot for the elements that should appear at the top of the list
	 */
	header: {};

	/**
	 * Slot for the elements that should appear at the bottom of the list (e.g. `VirtualList` component from `svelte-infinite-loading`)
	 */
	footer: {};
}


export interface ItemsUpdatedDetail {
	/**
	 * Index of the first visible item
	 */
	start: number;

	/**
	 * Index of the last visible item
	 */
	end: number;
}

export interface ItemsUpdatedEvent extends CustomEvent<ItemsUpdatedDetail> {
}


export interface AfterScrollDetail {
	/**
	 * The original scroll event
	 */
	event: Event;

	/**
	 * Either the value of `wrapper.scrollTop` or `wrapper.scrollLeft`
	 */
	offset: number;
}

export interface AfterScrollEvent extends CustomEvent<AfterScrollDetail> {
}


/**
 * VirtualList events
 */
export interface VirtualListEvents {
	/**
	 * Fired when the visible items are updated
	 */
	itemsUpdated: ItemsUpdatedEvent;

	/**
	 * Fired after handling the scroll event
	 */
	afterScroll: AfterScrollEvent;
}


/**
 * VirtualList component
 */
export default class VirtualList extends SvelteComponentTyped<VirtualListProps, VirtualListEvents, VirtualListSlots> {
}
