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
	import { ListState } from './utils/ListState.svelte.js';
	import { ListProps } from './utils/ListProps.svelte.js';
	/** @import { VirtualListProps, VirtualListEvents, VirtualListSnippets } from './types.js'; */

	/** @type {VirtualListProps & VirtualListEvents & VirtualListSnippets} */
	let {
		/* Props: */

		height = '100%',
		width = '100%',

		itemCount,
		itemSize,
		estimatedItemSize = 0,
		stickyIndices = [],
		getKey,

		scrollDirection = DIRECTION.VERTICAL,
		scrollOffset = 0,
		scrollToIndex = -1,
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
	let wrapperStyle = $state.raw('');
	let innerStyle = $state.raw('');

	let wrapperHeight = $state(400);
	let wrapperWidth = $state(400);

	/** @type {{ index: number, style: string }[]} */
	let items = $state.raw([]);

	const _props = new ListProps(
		scrollToIndex,
		scrollToAlignment,
		scrollOffset,
		itemCount,
		itemSize,
		estimatedItemSize,
		Number.isFinite(height) ? height : 400,
		Number.isFinite(width) ? width : 400,
		stickyIndices
	);

	const _state = new ListState(scrollOffset || 0);

	const sizeAndPositionManager = new SizeAndPositionManager(
		itemSize,
		itemCount,
		_props.estimatedItemSize
	);

	// Effect 0: Event listener
	$effect(() => {
		const options = { passive: true };
		wrapper.addEventListener('scroll', handleScroll, options);

		return () => {
			// @ts-expect-error because options is not really needed, but maybe in the future
			wrapper.removeEventListener('scroll', handleScroll, options);
		};
	});

	// Effect 1: Update props from user provided props
	$effect(() => {
		_props.listen(
			scrollToIndex,
			scrollToAlignment,
			scrollOffset,
			itemCount,
			itemSize,
			estimatedItemSize,
			Number.isFinite(height) ? height : wrapperHeight,
			Number.isFinite(width) ? width : wrapperWidth,
			stickyIndices
		);

		untrack(() => {
			let doRecomputeSizes = false;

			if (_props.haveSizesChanged) {
				sizeAndPositionManager.updateConfig(itemSize, itemCount, _props.estimatedItemSize);
				doRecomputeSizes = true;
			}

			if (_props.hasScrollOffsetChanged)
				_state.listen(_props.scrollOffset, SCROLL_CHANGE_REASON.REQUESTED);
			else if (_props.hasScrollIndexChanged)
				_state.listen(
					getOffsetForIndex(scrollToIndex, scrollToAlignment),
					SCROLL_CHANGE_REASON.REQUESTED
				);

			if (_props.haveDimsOrStickyIndicesChanged || doRecomputeSizes) recomputeSizes();

			_props.update();
		});
	});

	// Effect 2: Update UI from state
	$effect(() => {
		_state.offset;

		untrack(() => {
			if (_state.doRefresh) refresh();

			if (_state.doScrollToOffset) scrollTo(_state.offset);

			_state.update();
		});
	});

	/**
	 * Recomputes the sizes of the items and updates the visible items.
	 */
	const refresh = () => {
		const { start, end } = sizeAndPositionManager.getVisibleRange(
			scrollDirection === DIRECTION.VERTICAL ? _props.height : _props.width,
			_state.offset,
			overscanCount
		);

		/** @type {{ index: number, style: string }[]} */
		const visibleItems = [];

		const totalSize = sizeAndPositionManager.getTotalSize();
		const heightUnit = typeof height === 'number' ? 'px' : '';
		const widthUnit = typeof width === 'number' ? 'px' : '';

		if (scrollDirection === DIRECTION.VERTICAL) {
			wrapperStyle = `height:${height}${heightUnit};width:${width}${widthUnit};`;
			innerStyle = `flex-direction:column;height:${totalSize}px;`;
		} else {
			wrapperStyle = `height:${height}${heightUnit};width:${width}${widthUnit};`;
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
	};

	/**
	 * Scrolls the list to a specific coordinate.
	 * @param {number} value
	 */
	const scrollTo = (value) => {
		wrapper.scroll({
			[SCROLL_PROP[scrollDirection]]: value,
			behavior: scrollToBehaviour
		});
	};

	/**
	 * Recomputes the sizes of the items in the list.
	 * @param {number} startIndex
	 */
	export const recomputeSizes = (startIndex = scrollToIndex) => {
		styleCache = {};
		if (startIndex >= 0) sizeAndPositionManager.resetItem(startIndex);
		refresh();
	};

	/**
	 * Calculates the offset for a given index based on the scroll direction and alignment.
	 * @param {number} index
	 * @param {import('./types.js').Alignment} align
	 */
	const getOffsetForIndex = (index, align = scrollToAlignment) => {
		if (index < 0 || index >= itemCount) index = 0;

		return sizeAndPositionManager.getUpdatedOffsetForIndex(
			align,
			scrollDirection === DIRECTION.VERTICAL ? _props.height : _props.width,
			_state.offset || 0,
			index
		);
	};

	/**
	 * Handles the scroll event on the wrapper element.
	 * @param {Event} event
	 */
	const handleScroll = (event) => {
		const offset = getWrapperOffset();

		if (offset < 0 || _state.offset === offset || event.target !== wrapper) return null;

		_state.listen(offset, SCROLL_CHANGE_REASON.OBSERVED);

		if (handleAfterScroll) handleAfterScroll({ offset, event });
	};

	/**
	 * Returns the current scroll offset of the wrapper element.
	 * @returns {number}
	 */
	const getWrapperOffset = () => {
		return wrapper[SCROLL_PROP_LEGACY[scrollDirection]];
	};

	/**
	 * Returns the style for a given item index.
	 * @param {number} index The index of the item
	 * @param {boolean} sticky Whether the item should be sticky or not
	 */
	const getStyle = (index, sticky) => {
		if (styleCache[index]) return styleCache[index];

		const { size, offset } = sizeAndPositionManager.getSizeAndPositionForIndex(index);

		let style;

		if (scrollDirection === DIRECTION.VERTICAL) {
			style = `left:0;width:100%;height:${size}px;`;

			if (sticky)
				style += `position:sticky;flex-grow:0;z-index:1;top:0;margin-top:${offset}px;margin-bottom:${-(offset + size)}px;`;
			else style += `position:absolute;top:${offset}px;`;
		} else {
			style = `top:0;width:${size}px;`;

			if (sticky)
				style += `position:sticky;z-index:1;left:0;margin-left:${offset}px;margin-right:${-(offset + size)}px;`;
			else style += `position:absolute;height:100%;left:${offset}px;`;
		}

		styleCache[index] = style;

		return styleCache[index];
	};
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
