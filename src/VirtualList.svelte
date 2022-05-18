<script context="module">
	/**
	 * the third argument for event bundler
	 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	 */
	const thirdEventArg = (() => {
		let result = false;

		try {
			const arg = Object.defineProperty({}, 'passive', {
				get() {
					result = { passive: true };
					return true;
				},
			});

			window.addEventListener('testpassive', arg, arg);
			window.remove('testpassive', arg, arg);
		} catch (e) { /* */
		}

		return result;
	})();
</script>

<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import SizeAndPositionManager from './SizeAndPositionManager';
	import {
		DIRECTION,
		SCROLL_CHANGE_REASON,
		SCROLL_PROP,
		SCROLL_PROP_LEGACY,
	} from './constants';

	export let height;
	export let width = '100%';

	export let itemCount;
	export let itemSize;
	export let estimatedItemSize = null;
	export let stickyIndices = null;
	export let getKey = null;

	export let scrollDirection = DIRECTION.VERTICAL;
	export let scrollOffset = null;
	export let scrollToIndex = null;
	export let scrollToAlignment = null;
	export let scrollToBehaviour = 'instant';

	export let overscanCount = 3;

	const dispatchEvent = createEventDispatcher();

	const sizeAndPositionManager = new SizeAndPositionManager({
		itemCount,
		itemSize,
		estimatedItemSize: getEstimatedItemSize(),
	});

	let mounted = false;
	let wrapper;
	let items = [];

	let state = {
		offset:             scrollOffset || (scrollToIndex != null && items.length && getOffsetForIndex(scrollToIndex)) || 0,
		scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
	};

	let prevState = state;
	let prevProps = {
		scrollToIndex,
		scrollToAlignment,
		scrollOffset,
		itemCount,
		itemSize,
		estimatedItemSize,
	};

	let styleCache = {};
	let wrapperStyle = '';
	let innerStyle = '';

	$: {
		/* listen to updates: */ scrollToIndex, scrollToAlignment, scrollOffset, itemCount, itemSize, estimatedItemSize;
		propsUpdated();
	}

	$: {
		/* listen to updates: */ state;
		stateUpdated();
	}

	$: {
		/* listen to updates: */ height, width, stickyIndices;
		if (mounted) recomputeSizes(0); // call scroll.reset;
	}

	refresh(); // Initial Load

	onMount(() => {
		mounted = true;

		wrapper.addEventListener('scroll', handleScroll, thirdEventArg);

		if (scrollOffset != null) {
			scrollTo(scrollOffset);
		} else if (scrollToIndex != null) {
			scrollTo(getOffsetForIndex(scrollToIndex));
		}
	});

	onDestroy(() => {
		if (mounted) wrapper.removeEventListener('scroll', handleScroll);
	});


	function propsUpdated() {
		if (!mounted) return;

		const scrollPropsHaveChanged =
			      prevProps.scrollToIndex !== scrollToIndex ||
			      prevProps.scrollToAlignment !== scrollToAlignment;
		const itemPropsHaveChanged =
			      prevProps.itemCount !== itemCount ||
			      prevProps.itemSize !== itemSize ||
			      prevProps.estimatedItemSize !== estimatedItemSize;

		if (itemPropsHaveChanged) {
			sizeAndPositionManager.updateConfig({
				itemSize,
				itemCount,
				estimatedItemSize: getEstimatedItemSize(),
			});

			recomputeSizes();
		}

		if (prevProps.scrollOffset !== scrollOffset) {
			state = {
				offset:             scrollOffset || 0,
				scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
			};
		} else if (
			typeof scrollToIndex === 'number' &&
			(scrollPropsHaveChanged || itemPropsHaveChanged)
		) {
			state = {
				offset: getOffsetForIndex(
					scrollToIndex,
					scrollToAlignment,
					itemCount,
				),

				scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
			};
		}

		prevProps = {
			scrollToIndex,
			scrollToAlignment,
			scrollOffset,
			itemCount,
			itemSize,
			estimatedItemSize,
		};
	}

	function stateUpdated() {
		if (!mounted) return;

		const { offset, scrollChangeReason } = state;

		if (
			prevState.offset !== offset ||
			prevState.scrollChangeReason !== scrollChangeReason
		) {
			refresh();
		}

		if (prevState.offset !== offset && scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
			scrollTo(offset);
		}

		prevState = state;
	}

	function refresh() {
		const { offset } = state;
		const { start, stop } = sizeAndPositionManager.getVisibleRange({
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			offset,
			overscanCount,
		});

		let updatedItems = [];

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
				if (hasStickyIndices && stickyIndices.includes(index)) {
					continue;
				}

				updatedItems.push({
					index,
					style: getStyle(index, false),
				});
			}

			dispatchEvent('itemsUpdated', {
				start,
				end: stop,
			});
		}

		items = updatedItems;
	}


	function scrollTo(value) {
		if ('scroll' in wrapper) {
			wrapper.scroll({
				[SCROLL_PROP[scrollDirection]]: value,
				behavior:                       scrollToBehaviour,
			});
		} else {
			wrapper[SCROLL_PROP_LEGACY[scrollDirection]] = value;
		}
	}

	export function recomputeSizes(startIndex = 0) {
		styleCache = {};
		sizeAndPositionManager.resetItem(startIndex);
		refresh();
	}

	function getOffsetForIndex(index, align = scrollToAlignment, _itemCount = itemCount) {
		if (index < 0 || index >= _itemCount) {
			index = 0;
		}

		return sizeAndPositionManager.getUpdatedOffsetForIndex({
			align,
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			currentOffset: state.offset || 0,
			targetIndex:   index,
		});
	}

	function handleScroll(event) {
		const offset = getWrapperOffset();

		if (offset < 0 || state.offset === offset || event.target !== wrapper) return;

		state = {
			offset,
			scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED,
		};

		dispatchEvent('afterScroll', {
			offset,
			event,
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

		return styleCache[index] = style;
	}
</script>

<div bind:this={wrapper} class="virtual-list-wrapper" style={wrapperStyle}>
	<slot name="header" />

	<div class="virtual-list-inner" style={innerStyle}>
		{#each items as item (getKey ? getKey(item.index) : item.index)}
			<slot name="item" style={item.style} index={item.index} />
		{/each}
	</div>

	<slot name="footer" />
</div>

<style>
	.virtual-list-wrapper {
		overflow:                   auto;
		will-change:                transform;
		-webkit-overflow-scrolling: touch;
	}

	.virtual-list-inner {
		position:   relative;
		display:    flex;
		width:      100%;
	}
</style>
