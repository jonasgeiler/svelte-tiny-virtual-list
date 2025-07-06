// TODO: Refactor further
export class ListProps {
	/**
	 * @param {number} [scrollToIndex]
	 * @param {import('./types.js').Alignment} scrollToAlignment
	 * @param {number} [scrollOffset]
	 * @param {number} itemCount
	 * @param {import('./types.js').ItemSize} itemSize
	 * @param {number} estimatedItemSize
	 * @param {string | number} height
	 * @param {string | number} width
	 * @param {number[]} stickyIndices
	 */
	constructor(
		scrollToIndex,
		scrollToAlignment,
		scrollOffset,
		itemCount,
		itemSize,
		estimatedItemSize,
		height,
		width,
		stickyIndices
	) {
		this.scrollToIndex = $state(scrollToIndex);
		this.scrollToAlignment = $state(scrollToAlignment);
		this.scrollOffset = $state(scrollOffset);
		this.itemCount = $state(itemCount);
		this.itemSize = $state(itemSize);
		this.estimatedItemSize = $state(estimatedItemSize);
		this.height = $state(height);
		this.width = $state(width);
		this.stickyIndices = $state(stickyIndices);

		/**
		 * @typedef {object} PreviousProps
		 * @property {number} [scrollToIndex]
		 * @property {import('./types.js').Alignment} scrollToAlignment
		 * @property {number} [scrollOffset]
		 * @property {number} itemCount
		 * @property {import('./types.js').ItemSize} itemSize
		 * @property {number} estimatedItemSize
		 * @property {string | number} height
		 * @property {string | number} width
		 * @property {number[]} stickyIndices
		 */

		/** @type {PreviousProps} */
		this.previous = $state.raw({
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
	}

	/**
	 * @param {number} [scrollToIndex]
	 * @param {import('./types.js').Alignment} scrollToAlignment
	 * @param {number} [scrollOffset]
	 * @param {number} itemCount
	 * @param {import('./types.js').ItemSize} itemSize
	 * @param {number} estimatedItemSize
	 * @param {string | number} height
	 * @param {string | number} width
	 * @param {number[]} stickyIndices
	 */
	update(
		scrollToIndex,
		scrollToAlignment,
		scrollOffset,
		itemCount,
		itemSize,
		estimatedItemSize,
		height,
		width,
		stickyIndices
	) {
		this.scrollToIndex = scrollToIndex;
		this.scrollToAlignment = scrollToAlignment;
		this.scrollOffset = scrollOffset;
		this.itemCount = itemCount;
		this.itemCount = itemCount;
		this.itemSize = itemSize;
		this.estimatedItemSize = estimatedItemSize;
		this.height = height;
		this.width = width;
		this.stickyIndices = stickyIndices;
	}

	updatePrevious() {
		this.previous = {
			scrollToIndex: $state.snapshot(this.scrollToIndex),
			scrollToAlignment: $state.snapshot(this.scrollToAlignment),
			scrollOffset: $state.snapshot(this.scrollOffset),
			itemCount: $state.snapshot(this.itemCount),
			itemSize: $state.snapshot(this.itemSize),
			estimatedItemSize: $state.snapshot(this.estimatedItemSize),
			height: $state.snapshot(this.height),
			width: $state.snapshot(this.width),
			stickyIndices: $state.snapshot(this.stickyIndices)
		};
	}
}
