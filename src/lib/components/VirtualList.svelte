<script>
	import SizeAndPositionManager from '$lib/utils/SizeAndPositionManager';
	import {
		DIRECTION,
		SCROLL_CHANGE_REASON,
		SCROLL_PROP,
		SCROLL_PROP_LEGACY,
	} from '$lib/utils/constants';
	import { ListState } from '$lib/utils/ListState.js';
	import { ListProps } from '$lib/utils/ListProps.js';

	let {
		/**
		 * @type {number}
		 */
		height,

		/**
		 * @type {string}
		 */
		width = '100%',

		/**
		 * @type {number}
		 */
		itemCount,

		/**
		 * @type {number}
		 */
		itemSize,

		/**
		 * @type {number}
		 */
		estimatedItemSize = null,

		/**
		 * @type {Number[]}
		 */
		stickyIndices = null,

		/**
		 * @type {function}
		 * @param {number} index
		 */
		getKey = null,

		/**
		 * @type {'horizontal'|'vertical'}
		 */
		scrollDirection = DIRECTION.VERTICAL,

		/**
		 * @type {number}
		 */
		scrollOffset = null,

		/**
		 * @type {number}
		 */
		scrollToIndex = null,

		/**
		 * @type {'auto'|'start'|'center'|'end'}
		 */
		scrollToAlignment = null,

		/**
		 * @type {'auto'|'instant'|'smooth'}
		 */
		scrollToBehaviour = 'instant',

		/**
		 * @type {number}
		 */
		overscanCount = 3,

		/**
		 * @type {function}
		 * @param {object} object { start, end }
		 */
		onListItemsUpdate = () => null,

		/**
		 * @type {function}
		 * @param {object} object { offset, event }
		 */
		onAfterScroll = () => null,

		/**
		 * @type {snippet}
		 */
		header = null,

		/**
		 * @type {snippet}
		 */
		footer = null,

		/**
		 * @type {snippet}
		 * @param {object} item { index, style }
		 */
		row = null
	} = $props();

	const sizeAndPositionManager = new SizeAndPositionManager({
		itemCount,
		itemSize,
		estimatedItemSize: getEstimatedItemSize()
	});

	let wrapper = $state(null);
	let items = $state([]);

	let curState = $state(new ListState(scrollOffset || (scrollToIndex != null && itemCount && getOffsetForIndex(scrollToIndex))));

	let prevState = new ListState();
	let prevProps = new ListProps(
		scrollToIndex,
		scrollToAlignment,
		scrollOffset,
		itemCount,
		itemSize,
		estimatedItemSize,
		height,
		width,
		stickyIndices
	);

	let styleCache = $state({});
	let wrapperStyle = $state("");
	let innerStyle = $state("");

	// Listen for updates to props
	$effect(() => {
		const { scrollOffsetHasChanged, scrollPropsHaveChanged, itemPropsHaveChanged, listPropsHaveChanged } = prevProps.havePropsChanged(scrollOffset, scrollToIndex, scrollToAlignment, itemCount, itemSize, estimatedItemSize, height, width, stickyIndices);

		if (itemPropsHaveChanged)
			sizeAndPositionManager.updateConfig({
				itemSize,
				itemCount,
				estimatedItemSize: getEstimatedItemSize(),
			});

		if (listPropsHaveChanged || itemPropsHaveChanged)
			recomputeSizes();

		if (scrollOffsetHasChanged) {
			curState = new ListState(scrollOffset);
			
			if (typeof scrollToIndex === 'number')
				scrollTo(scrollOffset);
			
		} else if (typeof scrollToIndex === 'number' && (scrollPropsHaveChanged || itemPropsHaveChanged)) {
			const offsetForIndex = getOffsetForIndex(
					scrollToIndex,
					scrollToAlignment,
					itemCount
				);
			curState = new ListState(offsetForIndex);
			scrollTo(offsetForIndex);
		}
	});

	// Listen for updates to local state
	$effect(() => {
		if (prevState.offset !== curState.offset || prevState.scrollChangeReason !== curState.scrollChangeReason)
			refresh();

		if (prevState.offset !== curState.offset && curState.scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED)
			scrollTo(curState.offset);

		prevState = curState;
	});

	// Initial Load
	refresh();

	function refresh() {
		const { offset } = curState;
		const { start, stop } = sizeAndPositionManager.getVisibleRange({
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			offset,
			overscanCount,
		});

		const updatedItems = [];

		const totalSize = sizeAndPositionManager.getTotalSize();
		if (scrollDirection === DIRECTION.VERTICAL) {
			wrapperStyle = `height:${height}px;width:${width};`;
			innerStyle = `flex-direction:column;height:${totalSize}px;`;
		} else {
			wrapperStyle = `height:${height};width:${width}px`;
			innerStyle = `min-height:100%;width:${totalSize}px;`;
		}

		const hasStickyIndices = stickyIndices != null && stickyIndices.length !== 0;
		if (hasStickyIndices) {
			for (let i = 0; i < stickyIndices.length; i++) {
				const index = stickyIndices[i];
				updatedItems.push({
					index,
					style: getStyle(index, true),
				});
			}
		}

		if (start !== undefined && stop !== undefined) {
			for (let index = start; index <= stop; index++) {
				if (hasStickyIndices && stickyIndices.includes(index))
					continue;

				updatedItems.push({
					index,
					style: getStyle(index, false)
				});
			}

			onListItemsUpdate({
				start,
				end: stop,
			});
		}

		items = updatedItems;
	}


	function scrollTo(value) {
		if ('scroll' in wrapper)
			wrapper.scroll({
				[SCROLL_PROP[scrollDirection]]: value,
				behavior: scrollToBehaviour
			});
		else
			wrapper[SCROLL_PROP_LEGACY[scrollDirection]] = value;
	}

	export function recomputeSizes(startIndex = 0) {
		styleCache = {};
		sizeAndPositionManager.resetItem(startIndex);
		refresh();
	}

	function getOffsetForIndex(index, align = scrollToAlignment, _itemCount = itemCount) {
		if (index < 0 || index >= _itemCount)
			index = 0;

		return sizeAndPositionManager.getUpdatedOffsetForIndex({
			align,
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			currentOffset: curState.offset || 0,
			targetIndex:   index,
		});
	}

	function handleScroll(event) {
		const offset = getWrapperOffset();

		if (offset < 0 || curState.offset === offset || event.target !== wrapper)
			return;

		curState = new ListState(offset, SCROLL_CHANGE_REASON.OBSERVED);

		onAfterScroll({
			offset,
			event
		});
	}

	function getWrapperOffset() {
		return wrapper[SCROLL_PROP_LEGACY[scrollDirection]];
	}

	function getEstimatedItemSize() {
		return (
			estimatedItemSize ||
			(typeof itemSize === 'number' && itemSize) ||
			50
		);
	}

	function getStyle(index, sticky) {
		if (styleCache[index]) return styleCache[index];

		const { size, offset } = sizeAndPositionManager.getSizeAndPositionForIndex(index);

		let style;

		if (scrollDirection === DIRECTION.VERTICAL) {
			style = `left:0;width:100%;height:${size}px;`;

			if (sticky)
				style += `position:sticky;flex-grow:0;z-index:1;top:0;margin-top:${offset}px;margin-bottom:${-(offset + size)}px;`;
			else
				style += `position:absolute;top:${offset}px;`;
		} else {
			style = `top:0;width:${size}px;`;

			if (sticky)
				style += `position:sticky;z-index:1;left:0;margin-left:${offset}px;margin-right:${-(offset + size)}px;`;
			else
				style += `position:absolute;height:100%;left:${offset}px;`;
		}

		return styleCache[index] = style;
	}
</script>

<div
	bind:this={wrapper}
	class="overflow-auto will-change-transform"
	style={wrapperStyle}
	on:scroll|passive={handleScroll}
>
	{#if header}
		{@render header()}
	{/if}

	<div
		class="relative flex w-full"
		style={innerStyle}
	>
		{#each items as item (getKey ? getKey(item.index) : item.index)}
			{@render row({ index: item.index, style: item.style })}
		{/each}
	</div>

	{#if footer}
		{@render footer()}
	{/if}
</div>
