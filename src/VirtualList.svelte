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
		STYLE_ITEM,
		STYLE_STICKY_ITEM,
		MARGIN_PROP,
		OPPOSITE_MARGIN_PROP,
		POSITION_PROP,
		SCROLL_PROP,
		SIZE_PROP,
	} from './constants';

	export let height;
	export let width = '100%';

	export let itemCount;
	export let itemSize;
	export let estimatedItemSize = null;
	export let stickyIndices = null;

	export let scrollDirection = DIRECTION.VERTICAL;
	export let scrollOffset = null;
	export let scrollToIndex = null;
	export let scrollToAlignment = null;

	export let overscanCount = 3;

	const dispatchEvent = createEventDispatcher();

	const sizeAndPositionManager = new SizeAndPositionManager({
		itemCount:         itemCount,
		itemSizeGetter:    itemSizeGetter(itemSize),
		estimatedItemSize: getEstimatedItemSize(),
	});

	let mounted = false;
	let rootNode;
	let items = [];

	let state = {
		offset:             scrollOffset || (scrollToIndex != null && getOffsetForIndex(scrollToIndex)) || 0,
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

	$: propsUpdated(
		scrollToIndex,
		scrollToAlignment,
		scrollOffset,
		itemCount,
		itemSize,
		estimatedItemSize,
	);
	$: stateUpdated(state);

	refresh(); // Initial Load

	onMount(() => {
		mounted = true;

		rootNode.addEventListener('scroll', handleScroll, thirdEventArg);

		if (scrollOffset != null) {
			scrollTo(scrollOffset);
		} else if (scrollToIndex != null) {
			scrollTo(getOffsetForIndex(scrollToIndex));
		}
	});

	onDestroy(() => {
		if (mounted) rootNode.removeEventListener('scroll', handleScroll);
	})


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
				itemSizeGetter: itemSizeGetter(itemSize),
				itemCount:         itemCount,
				estimatedItemSize: getEstimatedItemSize(),
			});

			recomputeSizes();
			refresh();
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

	export function refresh() {
		const { offset } = state;
		const { start, stop } = sizeAndPositionManager.getVisibleRange({
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			offset,
			overscanCount,
		});

		let updatedItems = [];

		wrapperStyle = 'height:' + cssVal(height) + ';width:' + cssVal(width) + ';';
		innerStyle = SIZE_PROP[scrollDirection] + ':' + cssVal(sizeAndPositionManager.getTotalSize()) + ';';

		if (stickyIndices != null && stickyIndices.length !== 0) {
			stickyIndices.forEach(index =>
				updatedItems.push({
					index,
					style: getStyle(index, true),
				}),
			);

			if (scrollDirection === DIRECTION.HORIZONTAL) {
				innerStyle += 'display:flex;';
			}
		}

		if (start !== undefined && stop !== undefined) {
			for (let index = start; index <= stop; index++) {
				if (stickyIndices != null && stickyIndices.includes(index)) {
					continue;
				}

				updatedItems.push({
					index,
					style: getStyle(index, false),
				});
			}

			dispatchEvent('itemsUpdated', {
				startIndex: start,
				stopIndex:  stop,
			});
		}

		items = updatedItems;
	}


	function itemSizeGetter(_itemSize) {
		return index => getSize(index, _itemSize);
	}

	function scrollTo(value) {
		rootNode[SCROLL_PROP[scrollDirection]] = value;
	}

	export function recomputeSizes(startIndex = 0) {
		styleCache = {};
		sizeAndPositionManager.resetItem(startIndex);
	}

	function getOffsetForIndex(index, _scrollToAlignment = scrollToAlignment, _itemCount = itemCount) {
		if (index < 0 || index >= _itemCount) {
			index = 0;
		}

		return sizeAndPositionManager.getUpdatedOffsetForIndex({
			align:         _scrollToAlignment,
			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
			currentOffset: state.offset || 0,
			targetIndex:   index,
		});
	}

	function handleScroll(event) {
		const offset = getNodeOffset();

		if (offset < 0 || state.offset === offset || event.target !== rootNode) return;

		state = {
			offset,
			scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED,
		};

		dispatchEvent('afterScroll', {
			offset,
			event
		})
	}

	function getNodeOffset() {
		return rootNode[SCROLL_PROP[scrollDirection]];
	}

	function getEstimatedItemSize() {
		return (
			estimatedItemSize ||
			(typeof itemSize === 'number' && itemSize) ||
			50
		);
	}

	function getSize(index, _itemSize) {
		if (typeof _itemSize === 'function') {
			return _itemSize(index);
		}

		return Array.isArray(_itemSize) ? _itemSize[index] : _itemSize;
	}

	function getStyle(index, sticky) {
		const style = styleCache[index];

		if (style) return style;

		const { size, offset } = sizeAndPositionManager.getSizeAndPositionForIndex(index);

		return (styleCache[index] = sticky
			? STYLE_STICKY_ITEM +
			  SIZE_PROP[scrollDirection] + ':' + cssVal(size) + ';' +
			  MARGIN_PROP[scrollDirection] + ':' + cssVal(offset) + ';' +
			  OPPOSITE_MARGIN_PROP[scrollDirection] + ':' + cssVal(-(offset + size)) + ';'
			: STYLE_ITEM +
			  SIZE_PROP[scrollDirection] + ':' + cssVal(size) + ';' +
			  POSITION_PROP[scrollDirection] + ':' + cssVal(offset) + ';');
	}

	function cssVal(val) {
		return typeof val === 'number' ? val + 'px' : val;
	}
</script>

<div bind:this={rootNode}
     class="virtual-list-wrapper"
     style={wrapperStyle}>

	<slot name="header" />

	<div class="virtual-list-inner"
	     style={innerStyle}>
		{#each items as item (item.index)}
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
		width:      100%;
		min-height: 100%;
	}
</style>