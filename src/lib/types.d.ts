import type { Snippet } from 'svelte';

export type Alignment = 'auto' | 'start' | 'center' | 'end';
export type ScrollBehaviour = 'auto' | 'smooth' | 'instant';

export type Direction = 'horizontal' | 'vertical';

export type ItemSizeGetter = (index: number) => number;
export type ItemSize = number | number[] | ItemSizeGetter;

/**
 * VirtualList props
 */
export type VirtualListProps = (
	| {
			/**
			 * Indicate that the list should scroll vertically.
			 */
			scrollDirection?: 'vertical' | undefined;

			/**
			 * Width of the list view box.
			 * Defaults to `'100%'`.
			 */
			width?: number | string;

			/**
			 * Height of the list view box.
			 * This property will determine the number of rendered items.
			 */
			height: number;
	  }
	| {
			/**
			 * Indicate that the list should scroll horizontally.
			 */
			scrollDirection: 'horizontal';

			/**
			 * Width of the list view box.
			 * This property will determine the number of rendered items.
			 */
			width: number;

			/**
			 * Height of the list view box.
			 * Defaults to `'100%'`.
			 */
			height?: number | string;
	  }
) & {
	/**
	 * The number of items you want to render.
	 */
	itemCount: number;

	/**
	 * Either a fixed height/width (depending on the `scrollDirection`),
	 * an array containing the heights of all the items in your list,
	 * or a function that returns the height of an item given its index: `(index: number) => number`.
	 */
	itemSize: ItemSize;

	/**
	 * Used to control the scroll offset, but also useful for setting an initial scroll offset.
	 * Defaults to `0`.
	 */
	scrollOffset?: number;

	/**
	 * Item index to scroll to (by forcefully scrolling if necessary).
	 * Defaults to `-1`, which means no scrolling.
	 */
	scrollToIndex?: number;

	/**
	 * Used in combination with `scrollToIndex`, this prop controls the alignment of the scrolled to item.
	 * One of: `'start'` (default), `'center'`, `'end'` or `'auto'`.
	 * Use `'auto'` to scroll the least amount required to ensure that the specified `scrollToIndex` item is fully visible.
	 */
	scrollToAlignment?: Alignment;

	/**
	 * Used in combination with `scrollToIndex`, this prop controls the behaviour of the scrolling.
	 * One of: `'smooth'`, `'instant'` (default) or `'auto'`.
	 * See: https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll#behavior
	 */
	scrollToBehaviour?: ScrollBehaviour;

	/**
	 * An array of indexes (e.g.: `[0, 10, 25, 30]`) to make certain items in the list sticky (using CSS `position: sticky`).
	 * None by default.
	 */
	stickyIndices?: number[];

	/**
	 * Number of extra buffer items to render above/below the visible items.
	 * Tweaking this can help reduce scroll flickering on certain browsers/devices.
	 * Defaults to `3`.
	 */
	overscanCount?: number;

	/**
	 * Used to estimate the total size of the list before all of its items have actually been measured.
	 * The estimated total height is progressively adjusted as items are rendered.
	 * Defaults to `0`.
	 */
	estimatedItemSize?: number;

	/**
	 * Function that returns the key of an item in the list, which is used to uniquely identify an item.
	 * This is useful for dynamic data coming from a database or similar.
	 * If falsy (default), it's using the item's index.
	 */
	// biome-ignore lint/suspicious/noExplicitAny: Svelte allows any object as `{#each ...}` key
	getKey?: ((index: number) => any) | null;
};

/**
 * VirtualList snippets
 */
export interface VirtualListSnippets {
	/**
	 * Snippet for each list item.
	 * Called like `item({ index, style })` in the component.
	 */
	item: Snippet<
		[
			{
				/**
				 * Item index.
				 */
				index: number;

				/**
				 * Item style, must be applied to the slot (look above for example).
				 */
				style: string;
			}
		]
	>;

	/** @deprecated Use `item` snippet instead. */
	children?: Snippet<[{ index: number; style: string }]>;

	/**
	 * Snippet to optionally render a header above the list.
	 * Called like `{@render header()}` in the component.
	 */
	header?: Snippet;

	/**
	 * Snippet to optionally render a footer below the list.
	 * Called like `{@render footer()}` in the component.
	 */
	footer?: Snippet;
}

/**
 * VirtualList slots
 * @deprecated Use `VirtualListSnippets` instead.
 */
export type VirtualListSlots = VirtualListSnippets;

export interface ItemsUpdatedDetail {
	/**
	 * Index of the first visible item.
	 */
	start: number;

	/**
	 * Index of the last visible item.
	 */
	end: number;
}

type ItemsUpdatedEvent = (detail: ItemsUpdatedDetail) => void;

export interface AfterScrollDetail {
	/**
	 * The original scroll event.
	 */
	event: Event;

	/**
	 * Either the value of `wrapper.scrollTop` or `wrapper.scrollLeft`.
	 */
	offset: number;
}

type AfterScrollEvent = (detail: AfterScrollDetail) => void;

/**
 * VirtualList events
 */
export interface VirtualListEvents {
	/**
	 * Called when the visible items are updated.
	 */
	onItemsUpdated?: ItemsUpdatedEvent;

	/** @deprecated Use `onItemsUpdated` instead. */
	onListItemsUpdate?: ItemsUpdatedEvent;

	/**
	 * Called after handling the scroll event.
	 */
	onAfterScroll?: AfterScrollEvent;
}
