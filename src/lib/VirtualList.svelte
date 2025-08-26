<script>
	import { untrack } from 'svelte';
	import SizeAndPositionManager from './SizeAndPositionManager.js';
	import {
		ALIGNMENT,
		DIRECTION,
		SCROLL_CHANGE_REASON,
		SCROLL_PROP,
		SCROLL_PROP_LEGACY
	} from './constants.js';
	/** @import { VirtualListProps, VirtualListEvents, VirtualListSnippets } from './types.js'; */

	/** @type {VirtualListProps & VirtualListEvents & VirtualListSnippets} */
	let {
		/* Props: */

		height = '100%',
		width = '100%',

		itemCount,
		itemSize,
		estimatedItemSize: optEstimatedItemSize,
		stickyIndices = [],
		getKey,

		scrollDirection = DIRECTION.VERTICAL,
		scrollOffset,
		scrollToIndex,
		scrollToAlignment = ALIGNMENT.START,
		scrollToBehaviour = 'instant',

		overscanCount = 3,

		/* Events: */

		onItemsUpdated: handleItemsUpdated,
		onListItemsUpdate: handleListItemsUpdate, // DEPRECATED

		onAfterScroll: handleAfterScroll,

		/* Snippets: */

		item: itemSnippet,
		children: childrenSnippet, // DEPRECATED

		header: headerSnippet,
		footer: footerSnippet
	} = $props();

	let estimatedItemSize = $derived(
		optEstimatedItemSize || (typeof itemSize === 'number' && itemSize) || 50
	);
	const sizeAndPositionManager = new SizeAndPositionManager(itemSize, itemCount, estimatedItemSize);

	/** @type {HTMLDivElement} */
	let wrapper;
	let wrapperHeight = $state(400);
	let wrapperWidth = $state(400);
	/** @type {{ index: number, style: string }[]} */
	let items = $state.raw([]);

	/** @type {{ offset: number, changeReason: number }} */
	let scroll = $state.raw({
		offset: scrollOffset || (scrollToIndex !== undefined && getOffsetForIndex(scrollToIndex)) || 0,
		changeReason: SCROLL_CHANGE_REASON.REQUESTED
	});
	let prevScroll = $state.snapshot(scroll);

	let heightNumber = $derived(Number.isFinite(height) ? Number(height) : wrapperHeight);
	let widthNumber = $derived(Number.isFinite(width) ? Number(width) : wrapperWidth);
	let prevProps = {
		scrollToIndex: $state.snapshot(scrollToIndex),
		scrollToAlignment: $state.snapshot(scrollToAlignment),
		scrollOffset: $state.snapshot(scrollOffset),
		itemCount: $state.snapshot(itemCount),
		itemSize: typeof itemSize === 'function' ? itemSize : $state.snapshot(itemSize),
		estimatedItemSize: $state.snapshot(estimatedItemSize),
		heightNumber: $state.snapshot(heightNumber),
		widthNumber: $state.snapshot(widthNumber),
		stickyIndices: $state.snapshot(stickyIndices)
	};

	/** @type {Record<number, string>} */
	let styleCache = $state({});
	let wrapperStyle = $state.raw('');
	let innerStyle = $state.raw('');

	// Effect 0: Event listener
	$effect(() => {
		/** @type {number | undefined} */
		let frame;
		/** @param {Event} event */
		const handleScrollAsync = (event) => {
			if (frame !== undefined) {
				cancelAnimationFrame(frame);
			}
			frame = requestAnimationFrame(() => {
				handleScroll(event);
				frame = undefined;
			});
		};

		const options = { passive: true };
		wrapper.addEventListener('scroll', handleScrollAsync, options);

		return () => {
			// @ts-expect-error because options is not really needed, but maybe in the future
			wrapper.removeEventListener('scroll', handleScrollAsync, options);
		};
	});

	// Effect 1: Update props from user provided props
	$effect(() => {
		scrollToIndex;
		scrollToAlignment;
		scrollOffset;
		itemCount;
		itemSize;
		estimatedItemSize;
		heightNumber;
		widthNumber;
		stickyIndices;

		untrack(propsUpdated);
	});

	// Effect 2: Update scroll
	$effect(() => {
		scroll;

		untrack(scrollUpdated);
	});

	function propsUpdated() {
		const scrollPropsHaveChanged =
			prevProps.scrollToIndex !== scrollToIndex ||
			prevProps.scrollToAlignment !== scrollToAlignment;
		const itemPropsHaveChanged =
			prevProps.itemCount !== itemCount ||
			prevProps.itemSize !== itemSize ||
			prevProps.estimatedItemSize !== estimatedItemSize;

		let forceRecomputeSizes = false;
		if (itemPropsHaveChanged) {
			sizeAndPositionManager.updateConfig(itemSize, itemCount, estimatedItemSize);

			forceRecomputeSizes = true;
		}

		if (prevProps.scrollOffset !== scrollOffset) {
			scroll = {
				offset: scrollOffset || 0,
				changeReason: SCROLL_CHANGE_REASON.REQUESTED
			};
		} else if (
			typeof scrollToIndex === 'number' &&
			(scrollPropsHaveChanged || itemPropsHaveChanged)
		) {
			scroll = {
				offset: getOffsetForIndex(scrollToIndex),
				changeReason: SCROLL_CHANGE_REASON.REQUESTED
			};
		}

		if (
			forceRecomputeSizes ||
			prevProps.heightNumber !== heightNumber ||
			prevProps.widthNumber !== widthNumber ||
			prevProps.stickyIndices.toString() !== $state.snapshot(stickyIndices).toString()
		) {
			recomputeSizes();
		}

		prevProps = {
			scrollToIndex: $state.snapshot(scrollToIndex),
			scrollToAlignment: $state.snapshot(scrollToAlignment),
			scrollOffset: $state.snapshot(scrollOffset),
			itemCount: $state.snapshot(itemCount),
			itemSize: typeof itemSize === 'function' ? itemSize : $state.snapshot(itemSize),
			estimatedItemSize: $state.snapshot(estimatedItemSize),
			heightNumber: $state.snapshot(heightNumber),
			widthNumber: $state.snapshot(widthNumber),
			stickyIndices: $state.snapshot(stickyIndices)
		};
	}

	function scrollUpdated() {
		if (prevScroll.offset !== scroll.offset || prevScroll.changeReason !== scroll.changeReason) {
			refresh();
		}

		if (
			prevScroll.offset !== scroll.offset &&
			scroll.changeReason === SCROLL_CHANGE_REASON.REQUESTED
		) {
			wrapper.scroll({
				[SCROLL_PROP[scrollDirection]]: scroll.offset,
				behavior: scrollToBehaviour
			});
		}

		prevScroll = $state.snapshot(scroll);
	}

	/**
	 * Recomputes the sizes of the items and updates the visible items.
	 */
	function refresh() {
		const { start, end } = sizeAndPositionManager.getVisibleRange(
			scrollDirection === DIRECTION.VERTICAL ? heightNumber : widthNumber,
			scroll.offset,
			overscanCount
		);

		/** @type {{ index: number, style: string }[]} */
		const visibleItems = [];

		const totalSize = sizeAndPositionManager.getTotalSize();
		const heightUnit = typeof height === 'number' ? 'px' : '';
		const widthUnit = typeof width === 'number' ? 'px' : '';

		wrapperStyle = `height:${height}${heightUnit};width:${width}${widthUnit};`;
		if (scrollDirection === DIRECTION.VERTICAL) {
			innerStyle = `flex-direction:column;height:${totalSize}px;`;
		} else {
			innerStyle = `min-height:100%;width:${totalSize}px;`;
		}

		const hasStickyIndices = stickyIndices.length > 0;
		if (hasStickyIndices) {
			for (const index of stickyIndices) {
				visibleItems.push({
					index,
					style: getStyle(index, true)
				});
			}
		}

		if (start !== undefined && end !== undefined) {
			for (let index = start; index <= end; index++) {
				if (hasStickyIndices && stickyIndices.includes(index)) continue;

				visibleItems.push({
					index,
					style: getStyle(index, false)
				});
			}

			if (handleItemsUpdated) handleItemsUpdated({ start, end });
			if (handleListItemsUpdate) handleListItemsUpdate({ start, end }); // DEPRECATED
		}

		items = visibleItems;
	}

	/**
	 * Recomputes the sizes of the items in the list.
	 */
	export function recomputeSizes(startIndex = scrollToIndex) {
		styleCache = {};
		if (startIndex !== undefined && startIndex >= 0) {
			sizeAndPositionManager.resetItem(startIndex);
		}
		refresh();
	}

	/**
	 * Calculates the offset for a given index based on the scroll direction and alignment.
	 * @param {number} index
	 */
	function getOffsetForIndex(index) {
		if (index < 0 || index >= itemCount) index = 0;

		return sizeAndPositionManager.getUpdatedOffsetForIndex(
			scrollToAlignment,
			scrollDirection === DIRECTION.VERTICAL ? heightNumber : widthNumber,
			scroll.offset || 0,
			index
		);
	}

	/**
	 * Handles the scroll event on the wrapper element.
	 * @param {Event} event
	 */
	function handleScroll(event) {
		const offset = wrapper[SCROLL_PROP_LEGACY[scrollDirection]];

		if (offset < 0 || scroll.offset === offset || event.target !== wrapper) return;

		scroll = { offset, changeReason: SCROLL_CHANGE_REASON.OBSERVED };

		if (handleAfterScroll) handleAfterScroll({ offset, event });
	}

	/**
	 * Returns the style for a given item index.
	 * @param {number} index The index of the item
	 * @param {boolean} sticky Whether the item should be sticky or not
	 */
	function getStyle(index, sticky) {
		if (styleCache[index]) return styleCache[index];

		const { size, offset } = sizeAndPositionManager.getSizeAndPositionForIndex(index);

		let style;
		if (scrollDirection === DIRECTION.VERTICAL) {
			style = `left:0;width:100%;height:${size}px;`;

			if (sticky) {
				style += `position:sticky;flex-grow:0;z-index:1;top:0;margin-top:${offset}px;margin-bottom:${-(offset + size)}px;`;
			} else {
				style += `position:absolute;top:${offset}px;`;
			}
		} else {
			style = `top:0;width:${size}px;`;

			if (sticky) {
				style += `position:sticky;z-index:1;left:0;margin-left:${offset}px;margin-right:${-(offset + size)}px;`;
			} else {
				style += `position:absolute;height:100%;left:${offset}px;`;
			}
		}

		styleCache[index] = style;
		return styleCache[index];
	}
</script>

<div
	bind:this={wrapper}
	bind:offsetHeight={wrapperHeight}
	bind:offsetWidth={wrapperWidth}
	class="virtual-list-wrapper"
	style={wrapperStyle}
>
	{#if headerSnippet}
		{@render headerSnippet()}
	{/if}

	<div class="virtual-list-inner" style={innerStyle}>
		{#each items as item (getKey ? getKey(item.index) : item.index)}
			{@render (childrenSnippet || itemSnippet)({ style: item.style, index: item.index })}
		{/each}
	</div>

	{#if footerSnippet}
		{@render footerSnippet()}
	{/if}
</div>

<style>
	.virtual-list-wrapper {
		overflow: auto;
		will-change: transform;
		-webkit-overflow-scrolling: touch;
	}

	.virtual-list-inner {
		position: relative;
		display: flex;
		width: 100%;
	}
</style>
