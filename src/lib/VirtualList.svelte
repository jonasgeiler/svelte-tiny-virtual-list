<script>
	import { untrack } from 'svelte';
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

	/** @type {HTMLDivElement} */
	let wrapper;

	/** @type {Record<number, string>} */
	let styleCache = $state({});
	/** @type {Record<number, { size: number, offset: number }>} */
	let itemSizeAndPositionData = $state({});

	let wrapperHeight = $state(400);
	let wrapperWidth = $state(400);

	let heightNumber = $derived(Number.isFinite(height) ? Number(height) : wrapperHeight);
	let widthNumber = $derived(Number.isFinite(width) ? Number(width) : wrapperWidth);
	let estimatedItemSize = $derived(
		optEstimatedItemSize || (typeof itemSize === 'number' && itemSize) || 50
	);

	let prevProps = $state.raw({
		scrollToIndex,
		scrollToAlignment,
		scrollOffset,
		itemCount,
		itemSize,
		estimatedItemSize,
		height,
		width,
		stickyIndices
	});

	/** @type {{ offset: number, changeReason: number }} */
	let scroll = $state({
		offset:
			scrollOffset ||
			(scrollToIndex != null && items.length && getOffsetForIndex(scrollToIndex)) ||
			0,
		changeReason: SCROLL_CHANGE_REASON.REQUESTED
	});

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
			forceRecomputeSizes = true;
		}

		if (prevProps.scrollOffset !== scrollOffset) {
			scroll = {
				offset: scrollOffset,
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
			prevProps.height !== heightNumber ||
			prevProps.width !== widthNumber ||
			prevProps.stickyIndices.toString() !== $state.snapshot(stickyIndices).toString()
		) {
			styleCache = {};

			if (scrollToIndex && scrollToIndex >= 0) {
				lastMeasuredIndex = Math.min(lastMeasuredIndex, scrollToIndex - 1);
			}
		}

		prevProps = {
			scrollToIndex: $state.snapshot(scrollToIndex),
			scrollToAlignment: $state.snapshot(scrollToAlignment),
			scrollOffset: $state.snapshot(scrollOffset),
			itemCount: $state.snapshot(itemCount),
			itemSize: $state.snapshot(itemSize),
			estimatedItemSize: $state.snapshot(estimatedItemSize),
			height: $state.snapshot(height),
			width: $state.snapshot(width),
			stickyIndices: $state.snapshot(stickyIndices)
		};
	}

	$effect(() => {
		if (scroll.changeReason === SCROLL_CHANGE_REASON.REQUESTED) {
			wrapper.scroll({
				[SCROLL_PROP[scrollDirection]]: scroll.offset,
				behavior: scrollToBehaviour
			});
		}
	});

	$effect(() => {
		if (Array.isArray(itemSize) && itemSize.length < itemCount) {
			throw Error(`When itemSize is an array, itemSize.length can't be smaller than itemCount`);
		}
	});

	let wrapperStyle = $derived.by(() => {
		const heightUnit = typeof height === 'number' ? 'px' : '';
		const widthUnit = typeof width === 'number' ? 'px' : '';
		return `height:${height}${heightUnit};width:${width}${widthUnit};`;
	});

	/** @type {number | undefined} */
	let precomputedTotalSize = $state(undefined);

	$effect(() => {
		if (typeof itemSize === 'function') {
			// Just-in-time
			precomputedTotalSize = undefined;
			return;
		}

		let _totalSize = 0;
		for (let i = 0; i < itemCount; i++) {
			const size = Array.isArray(itemSize) ? itemSize[i] : itemSize;
			const offset = _totalSize;
			_totalSize += size;

			itemSizeAndPositionData[i] = {
				offset,
				size
			};
		}

		precomputedTotalSize = _totalSize;
	});

	let lastMeasuredIndex = $state(-1);

	let lastMeasuredSizeAndPosition = $derived(
		lastMeasuredIndex >= 0 ? itemSizeAndPositionData[lastMeasuredIndex] : { offset: 0, size: 0 }
	);

	let totalSize = $derived.by(() => {
		if (precomputedTotalSize !== undefined) {
			return precomputedTotalSize;
		}

		/**
		 * When itemSize is a function,
		 * This value will be completedly estimated initially.
		 * As items as measured the estimate will be updated.
		 */
		return (
			lastMeasuredSizeAndPosition.offset +
			lastMeasuredSizeAndPosition.size +
			(itemCount - lastMeasuredIndex - 1) * estimatedItemSize
		);
	});

	let innerStyle = $derived(
		scrollDirection === DIRECTION.VERTICAL
			? `flex-direction:column;height:${totalSize}px;`
			: `min-height:100%;width:${totalSize}px;`
	);

	/**
	 * This is used when itemSize is a function.
	 * just-in-time calculates (or used cached values) for items leading up to the index.
	 *
	 * @param {number} index
	 */
	function getJustInTimeSizeAndPositionForIndex(index) {
		if (index > lastMeasuredIndex) {
			let offset = lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size;

			for (let i = lastMeasuredIndex + 1; i <= index; i++) {
				const size =
					typeof itemSize === 'function'
						? itemSize(i)
						: Array.isArray(itemSize)
							? itemSize[i]
							: itemSize;

				if (size == null || Number.isNaN(size)) {
					throw Error(`Invalid size returned for index ${i} of value ${size}`);
				}

				itemSizeAndPositionData[i] = {
					offset,
					size
				};

				offset += size;
			}

			lastMeasuredIndex = index;
		}

		return itemSizeAndPositionData[index];
	}

	/**
	 * This method returns the size and position for the item at the specified index.
	 *
	 * @param {number} index
	 */
	function getSizeAndPositionForIndex(index) {
		if (index < 0 || index >= itemCount) {
			throw Error(`Requested index ${index} is outside of range 0..${itemCount}`);
		}

		return typeof itemSize === 'function'
			? getJustInTimeSizeAndPositionForIndex(index)
			: itemSizeAndPositionData[index];
	}

	/**
	 * @param {number} high
	 * @param {number} low
	 * @param {number} offset
	 */
	function binarySearch(high, low, offset) {
		let middle = 0;
		let currentOffset = 0;

		while (low <= high) {
			middle = low + Math.floor((high - low) / 2);
			currentOffset = getSizeAndPositionForIndex(middle).offset;

			if (currentOffset === offset) {
				return middle;
			} else if (currentOffset < offset) {
				low = middle + 1;
			} else if (currentOffset > offset) {
				high = middle - 1;
			}
		}

		if (low > 0) {
			return low - 1;
		}

		return 0;
	}

	/**
	 * @private
	 * @param {number} index
	 * @param {number} offset
	 */
	function exponentialSearch(index, offset) {
		let interval = 1;

		while (index < itemCount && getSizeAndPositionForIndex(index).offset < offset) {
			index += interval;
			interval *= 2;
		}

		return binarySearch(Math.min(index, itemCount - 1), Math.floor(index / 2), offset);
	}

	/**
	 * Searches for the item (index) nearest the specified offset.
	 *
	 * If no exact match is found the next lowest item index will be returned.
	 * This allows partially visible items (with offsets just before/above the fold) to be visible.
	 *
	 * @param {number} offset
	 */
	function findNearestItem(offset) {
		if (Number.isNaN(offset)) {
			throw Error(`Invalid offset ${offset} specified`);
		}

		// Our search algorithms find the nearest match at or below the specified offset.
		// So make sure the offset is at least 0 or no match will be found.
		offset = Math.max(0, offset);

		const _lastMeasuredIndex = Math.max(0, lastMeasuredIndex);

		if (lastMeasuredSizeAndPosition.offset >= offset) {
			// If we've already measured items within this range just use a binary search as it's faster.
			return binarySearch(_lastMeasuredIndex, 0, offset);
		} else {
			// If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
			// The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
			// The overall complexity for this approach is O(log n).
			return exponentialSearch(_lastMeasuredIndex, offset);
		}
	}

	/** @type {{start: number, end: number} | undefined} */
	let visibleRange = $state(undefined);

	$effect(() => {
		if (totalSize === 0) {
			visibleRange = undefined;
			return;
		}

		const maxOffset =
			scroll.offset + (scrollDirection === DIRECTION.VERTICAL ? heightNumber : widthNumber);
		let start = findNearestItem(scroll.offset);

		if (start === undefined) {
			throw Error(`Invalid offset ${scroll.offset} specified`);
		}

		const datum = getSizeAndPositionForIndex(start);
		scroll.offset = datum.offset + datum.size;

		let end = start;

		while (scroll.offset < maxOffset && end < itemCount - 1) {
			end++;
			scroll.offset += getSizeAndPositionForIndex(end).size;
		}

		if (overscanCount) {
			start = Math.max(0, start - overscanCount);
			end = Math.min(end + overscanCount, itemCount - 1);
		}

		visibleRange = {
			start,
			end
		};
	});

	/** @type {{ index: number, style: string }[]} */
	let items = $state([]);

	$effect(() => {
		/** @type {{ index: number, style: string }[]} */
		const visibleItems = [];

		const hasStickyIndices = stickyIndices.length > 0;
		if (hasStickyIndices) {
			for (const index of stickyIndices) {
				visibleItems.push({
					index,
					style: getStyle(index, true)
				});
			}
		}

		if (visibleRange !== undefined) {
			for (let index = visibleRange.start; index <= visibleRange.end; index++) {
				if (hasStickyIndices && stickyIndices.includes(index)) continue;

				visibleItems.push({
					index,
					style: getStyle(index, false)
				});
			}

			if (handleItemsUpdated)
				handleItemsUpdated({ start: visibleRange.start, end: visibleRange.end });
			if (handleListItemsUpdate)
				handleListItemsUpdate({ start: visibleRange.start, end: visibleRange.end }); // DEPRECATED
		}

		items = visibleItems;
	});

	/**
	 * Calculates the offset for a given index based on the scroll direction and alignment.
	 * @param {number} index
	 */
	function getOffsetForIndex(index) {
		if (index < 0 || index >= itemCount) index = 0;

		const containerSize = scrollDirection === DIRECTION.VERTICAL ? heightNumber : widthNumber;
		if (containerSize <= 0) {
			return 0;
		}

		const datum = getSizeAndPositionForIndex(index);
		const maxOffset = datum.offset;
		const minOffset = maxOffset - containerSize + datum.size;

		let idealOffset;

		switch (scrollToAlignment) {
			case ALIGNMENT.END:
				idealOffset = minOffset;
				break;
			case ALIGNMENT.CENTER:
				idealOffset = maxOffset - (containerSize - datum.size) / 2;
				break;
			case ALIGNMENT.START:
				idealOffset = maxOffset;
				break;
			default:
				idealOffset = Math.max(minOffset, Math.min(maxOffset, scroll.offset));
		}

		return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
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

		const { size, offset } = getSizeAndPositionForIndex(index);

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
