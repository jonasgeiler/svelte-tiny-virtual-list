<script>
	import { onMount, onDestroy } from 'svelte';
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
		height = '100%',

		width = '100%',

		itemCount = 0,

		itemSize = 0,

		estimatedItemSize = 0,

		stickyIndices = [],

		getKey = null,

		scrollDirection = DIRECTION.VERTICAL,

		scrollOffset = 0,

		scrollToIndex = -1,

		scrollToAlignment = 'start',

		scrollToBehaviour = 'instant',
		
		overscanCount = 3,

		onListItemsUpdate = () => null,

		onAfterScroll = () => null,

		header = null,

		footer = null,

		row = null,

		dangerously_set_classes_container = '',

		dangerously_set_classes_inner_container = ''
	} = $props();

	const sizeAndPositionManager = new SizeAndPositionManager({
		itemCount,
		itemSize,
		estimatedItemSize: getEstimatedItemSize()
	});

	let container = $state(null);
	let items = $state.frozen([]);

	let curState = $state.frozen(new ListState(scrollOffset || (scrollToIndex !== -1 && itemCount && getOffsetForIndex(scrollToIndex))));

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

	let styleCache = {};
	
	let containerStyle = $state("");
	let innerContainerStyle = $state("");

	let cContainer = $derived(`overflow-auto ${dangerously_set_classes_container}`);
	let cInnerContainer = $derived(`relative flex w-full ${dangerously_set_classes_inner_container}`);

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
			
			if (scrollToIndex >= 0)
				scrollTo(scrollOffset);
			
		} else if (scrollToIndex >= 0 && (scrollPropsHaveChanged || itemPropsHaveChanged)) {
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
			containerStyle = `height:${height}px;width:${width};`;
			innerContainerStyle = `flex-direction:column;height:${totalSize}px;`;
		} else {
			containerStyle = `height:${height};width:${width}px`;
			innerContainerStyle = `min-height:100%;width:${totalSize}px;`;
		}

		if (stickyIndices.length) {
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
				if (stickyIndices.length && stickyIndices.includes(index))
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
	};


	function scrollTo(value) {
		if ('scroll' in container)
			container.scroll({
				[SCROLL_PROP[scrollDirection]]: value,
				behavior: scrollToBehaviour
			});
		else
			container[SCROLL_PROP_LEGACY[scrollDirection]] = value;
	};

	export function recomputeSizes(startIndex = 0) {
		styleCache = {};
		sizeAndPositionManager.resetItem(startIndex);
		refresh();
	};

	function getOffsetForIndex(index, align = scrollToAlignment, _itemCount = itemCount) {
		if (index < 0 || index >= _itemCount)
			index = 0;

		return sizeAndPositionManager.getUpdatedOffsetForIndex({
			align,
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			currentOffset: curState.offset || 0,
			targetIndex:   index,
		});
	};

	function handleScroll(event) {
		const offset = getContainerOffset();

		if (offset < 0 || curState.offset === offset || event.target !== container)
			return;

		curState = new ListState(offset, SCROLL_CHANGE_REASON.OBSERVED);

		onAfterScroll({
			offset,
			event
		});
	};

	function getContainerOffset() {
		return container[SCROLL_PROP_LEGACY[scrollDirection]];
	};

	function getEstimatedItemSize() {
		return (
			estimatedItemSize ||
			(typeof itemSize === 'number' && itemSize) ||
			50
		);
	};

	function getStyle(index, sticky) {
		if (styleCache[index])
			return styleCache[index];

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
	};

	onMount(() => {
		if(container)
			container.addEventListener("scroll", handleScroll, { passive: true });
	});

	onDestroy(() => {
		if(container)
			container.removeEventListener("scroll", handleScroll, { passive: true });
	});
</script>

<div
	bind:this={container}
	class={cContainer}
	style={containerStyle}
>
	{#if header}
		{@render header()}
	{/if}

	<div
		class={cInnerContainer}
		style={innerContainerStyle}
	>
		{#each items as item (getKey ? getKey(item.index) : item.index)}
			{@render row({ index: item.index, style: item.style })}
		{/each}
	</div>

	{#if footer}
		{@render footer()}
	{/if}
</div>
