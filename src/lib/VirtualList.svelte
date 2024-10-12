<script>
	import { untrack } from 'svelte';
	import SizeAndPositionManager from './SizeAndPositionManager.js';
	import { DIRECTION, SCROLL_CHANGE_REASON, SCROLL_PROP, SCROLL_PROP_LEGACY } from './constants';
	import { ListState } from './utils/listState.svelte.js';
	import { ListProps } from './utils/listProps.svelte.js';

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

		header,
		footer,
		children
	} = $props();

	let wrapper = $state.raw();

	let styleCache = $state({});
	let wrapperStyle = $state.raw('');
	let innerStyle = $state.raw('');

	let items = $state.raw([]);

	const _props = new ListProps(
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

	const _state = new ListState(scrollOffset || 0);

	const sizeAndPositionManager = new SizeAndPositionManager({
		itemCount,
		itemSize,
		estimatedItemSize: _props.estimatedItemSize
	});

	// Effect 0: Event listener
	$effect(() => {
		wrapper.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			wrapper.removeEventListener('scroll', handleScroll);
		};
	});

	// Effect 1: Update props from user provided props
	$effect(() => {
		_props.listen(scrollToIndex, scrollToAlignment, scrollOffset, itemCount, itemSize, estimatedItemSize, height, width, stickyIndices);

		untrack(() => {
			let doRecomputeSizes = false;

			if (_props.haveSizesChanged) {
				sizeAndPositionManager.updateConfig({
					itemSize,
					itemCount,
					estimatedItemSize: _props.estimatedItemSize
				});
				doRecomputeSizes = true;
			}
			
			if (_props.hasScrollOffsetChanged)
				_state.listen(_props.scrollOffset, SCROLL_CHANGE_REASON.REQUESTED);
			else if (_props.hasScrollIndexChanged)
				_state.listen(getOffsetForIndex(scrollToIndex, scrollToAlignment), SCROLL_CHANGE_REASON.REQUESTED);

			if (_props.haveDimsOrStickyIndicesChanged || doRecomputeSizes)
				recomputeSizes();

			_props.update();
		});
	});

	// Effect 2: Update UI from state
	$effect(() => {
		_state.offset;
		
		untrack(() => {
			if (_state.doRefresh)
				refresh();

			if (_state.doScrollToOffset)
				scrollTo(_state.offset);

			_state.update();
		});
	});

	const refresh = () => {
		const { start, stop } = sizeAndPositionManager.getVisibleRange({
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			offset: _state.offset,
			overscanCount
		});

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

		const hasStickyIndices = Array.isArray(stickyIndices) && stickyIndices.length > 0;
		if (hasStickyIndices) {
			for (let i = 0; i < stickyIndices.length; i++) {
				const index = stickyIndices[i];
				visibleItems.push({
					index,
					style: getStyle(index, true)
				});
			}
		}

		if (start !== undefined && stop !== undefined) {
			for (let index = start; index <= stop; index++) {
				if (hasStickyIndices && stickyIndices.includes(index))
					continue;

				visibleItems.push({
					index,
					style: getStyle(index, false)
				});
			}

			onListItemsUpdate({ start, end: stop });
		}

		items = visibleItems;
	};

	const scrollTo = (value) => {
		if ('scroll' in wrapper)
			wrapper.scroll({
				[SCROLL_PROP[scrollDirection]]: value,
				behavior: scrollToBehaviour
			});
		else
			wrapper[SCROLL_PROP_LEGACY[scrollDirection]] = value;
	};

	export const recomputeSizes = (startIndex = scrollToIndex) => {
		styleCache = {};
		if (startIndex >= 0)
			sizeAndPositionManager.resetItem(startIndex);
		refresh();
	};

	const getOffsetForIndex = (index, align = scrollToAlignment) => {
		if (index < 0 || index >= itemCount)
			index = 0;

		return sizeAndPositionManager.getUpdatedOffsetForIndex({
			align,
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			currentOffset: _state.offset || 0,
			targetIndex: index
		});
	};

	const handleScroll = (event) => {
		const offset = getWrapperOffset();

		if (offset < 0 || _state.offset === offset || event.target !== wrapper)
			return null;

		_state.listen(offset, SCROLL_CHANGE_REASON.OBSERVED);

		onAfterScroll({ offset, event});
	};

	const getWrapperOffset = () => {
		return wrapper[SCROLL_PROP_LEGACY[scrollDirection]];
	};

	const getStyle = (index, sticky) => {
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

		styleCache[index] = style;

		return styleCache[index];
	};
</script>

<div
	bind:this={wrapper}
	class="virtual-list-wrapper"
	style={wrapperStyle}
>
	{#if header}
		{@render header()}
	{/if}

	{#if children}
		<div
			class="virtual-list-inner"
			style={innerStyle}
		>
			{#each items as item (getKey ? getKey(item.index) : item.index)}
				{@render children({ style: item.style, index: item.index })}
			{/each}
		</div>
	{/if}

	{#if footer}
		{@render footer()}
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
