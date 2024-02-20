/* Forked from react-virtualized 💖 */
import { ALIGNMENT } from './constants';

/**
 * @callback ItemSizeGetter
 * @param {number} index
 * @return {number}
 */

/**
 * @typedef ItemSize
 * @type {number | number[] | ItemSizeGetter}
 */

/**
 * @typedef SizeAndPosition
 * @type {object}
 * @property {number} size
 * @property {number} offset
 * @property {number} expandSize
 * @property {number} expandOffset
 */

/**
 * @typedef SizeAndPositionData
 * @type {Object.<number, SizeAndPosition>}
 */

/**
 * @typedef Options
 * @type {object}
 * @property {number} itemCount
 * @property {ItemSize} itemSize
 * @property {Array} expandItems
 * @property {ItemSize} expandItemSize
 * @property {number} estimatedItemSize
 * @property {number} estimatedExpandItemSize
 */

export default class SizeAndPositionManager {

	/**
	 * @param {Options} options
	 */
	constructor({ itemCount, itemSize, expandItems, expandItemSize, estimatedItemSize, estimatedExpandItemSize }) {
		/**
		 * @private
		 * @type {number}
		 */
		this.itemCount = itemCount;

		/**
		 * @private
		 * @type {ItemSize}
		 */
		this.itemSize = itemSize;

		/**
		 * @private
		 * @type {Array}
		 */
		this.expandItems = expandItems;

		/**
		 * @private
		 * @type {ItemSize}
		 */
		this.expandItemSize = expandItemSize;

		/**
		 * @private
		 * @type {number}
		 */
		this.estimatedItemSize = estimatedItemSize;

		/**
		 * @private
		 * @type {number}
		 */
		this.estimatedExpandItemSize = estimatedExpandItemSize;

		/**
		 * Cache of size and position data for items, mapped by item index.
		 *
		 * @private
		 * @type {SizeAndPositionData}
		 */
		this.itemSizeAndPositionData = {};

		/**
		 * Measurements for items up to this index can be trusted; items afterward should be estimated.
		 *
		 * @private
		 * @type {number}
		 */
		this.lastMeasuredIndex = -1;

		this.checkForMismatchItemSizeAndItemCount();

		if (!this.justInTime) this.computeTotalSizeAndPositionData();
	}

	get justInTime() {
		return typeof this.itemSize === 'function';
	}

	/**
	 * @param {Options} options
	 */
	updateConfig({ itemCount, itemSize, expandItems, expandItemSize, estimatedItemSize, estimatedExpandItemSize }) {
		if (itemCount != null) {
			this.itemCount = itemCount;
		}

		if (itemSize != null) {
			this.itemSize = itemSize;
		}

		if (expandItems != null) {
			this.expandItems = expandItems;
		}

		if (expandItemSize != null) {
			this.expandItemSize = expandItemSize;
		}

		if (estimatedItemSize != null) {
			this.estimatedItemSize = estimatedItemSize;
		}

		if (estimatedExpandItemSize != null) {
			this.estimatedExpandItemSize = estimatedExpandItemSize;
		}

		this.checkForMismatchItemSizeAndItemCount();

		if (this.justInTime && this.totalSize != null) {
			this.totalSize = undefined;
		} else {
			this.computeTotalSizeAndPositionData();
		}
	}

	checkForMismatchItemSizeAndItemCount() {
		if (Array.isArray(this.itemSize) && this.itemSize.length < this.itemCount) {
			throw Error(
				`When itemSize is an array, itemSize.length can't be smaller than itemCount`,
			);
		}
	}

	/**
	 * @param {number} index
	 */
	getSize(index) {
		const { itemSize } = this;

		if (typeof itemSize === 'function') {
			return itemSize(index);
		}

		return Array.isArray(itemSize) ? itemSize[index] : itemSize;
	}

	/**
	 * @param {number} index
	 */
	getExpandSize(index) {
		if (!this.expandItems[index]) return 0;
		
		const { expandItemSize } = this;

		if (typeof expandItemSize === 'function') {
			return expandItemSize(index);
		}

		return Array.isArray(expandItemSize) ? expandItemSize[index] : expandItemSize;
	}

	/**
	 * Compute the totalSize and itemSizeAndPositionData at the start,
	 * only when itemSize is a number or an array.
	 */
	computeTotalSizeAndPositionData() {
		let totalSize = 0;
		for (let i = 0; i < this.itemCount; i++) {
			const size = this.getSize(i);
			const expandSize = this.getExpandSize(i);
			const offset = totalSize;
			const expandOffset = totalSize + size;
			totalSize += size + expandSize;

			this.itemSizeAndPositionData[i] = {
				size,
				offset,
				expandSize,
				expandOffset,
			};
		}

		this.totalSize = totalSize;
	}

	getLastMeasuredIndex() {
		return this.lastMeasuredIndex;
	}


	/**
	 * This method returns the size and position for the item at the specified index.
	 *
	 * @param {number} index
	 */
	getSizeAndPositionForIndex(index) {
		if (index < 0 || index >= this.itemCount) {
			throw Error(
				`Requested index ${index} is outside of range 0..${this.itemCount}`,
			);
		}

		return this.justInTime
			? this.getJustInTimeSizeAndPositionForIndex(index)
			: this.itemSizeAndPositionData[index];
	}

	/**
	 * This is used when itemSize is a function.
	 * just-in-time calculates (or used cached values) for items leading up to the index.
	 *
	 * @param {number} index
	 */
	getJustInTimeSizeAndPositionForIndex(index) {
		if (index > this.lastMeasuredIndex) {
			const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
			let offset =
				    lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size;
			let expandOffset = lastMeasuredSizeAndPosition.expandOffset + lastMeasuredSizeAndPosition.expandSize;

			for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {
				const size = this.getSize(i);
				const expandSize = this.getExpandSize(i);
				if (size == null || isNaN(size)) {
					throw Error(`Invalid size returned for index ${i} of value ${size}`);
				}
				if (expandSize == null || isNaN(expandSize)) {
					throw Error(`Invalid expandSize returned for index ${i} of value ${expandSize}`);
				}

				this.itemSizeAndPositionData[i] = {
					offset,
					size,
					expandOffset,
					expandSize,
				};

				offset += size;
			}

			this.lastMeasuredIndex = index;
		}

		return this.itemSizeAndPositionData[index];
	}

	getSizeAndPositionOfLastMeasuredItem() {
		return this.lastMeasuredIndex >= 0
			? this.itemSizeAndPositionData[this.lastMeasuredIndex]
			: { offset: 0, size: 0, expandOffset: 0, expandSize: 0 };
	}

	/**
	 * Total size of all items being measured.
	 *
	 * @return {number}
	 */
	getTotalSize() {
		// Return the pre computed totalSize when itemSize is number or array.
		if (this.totalSize) return this.totalSize;
		/**
		 * When itemSize is a function,
		 * This value will be completedly estimated initially.
		 * As items as measured the estimate will be updated.
		 */
		const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();

		return (
			lastMeasuredSizeAndPosition.offset +
			lastMeasuredSizeAndPosition.size +
			(this.itemCount - this.lastMeasuredIndex - 1) * (this.estimatedItemSize + this.estimatedExpandItemSize)
		);
	}

	/**
	 * Determines a new offset that ensures a certain item is visible, given the alignment.
	 *
	 * @param {'auto' | 'start' | 'center' | 'end'} align Desired alignment within container
	 * @param {number | undefined} containerSize Size (width or height) of the container viewport
	 * @param {number | undefined} currentOffset
	 * @param {number | undefined} targetIndex
	 * @return {number} Offset to use to ensure the specified item is visible
	 */
	getUpdatedOffsetForIndex(align = ALIGNMENT.START, containerSize, currentOffset, targetIndex) {
		if (containerSize <= 0) {
			return 0;
		}

		const datum = this.getSizeAndPositionForIndex(targetIndex);
		const maxOffset = datum.offset;
		const minOffset = maxOffset - containerSize + datum.size;

		let idealOffset;

		switch (align) {
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
				idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
		}

		const totalSize = this.getTotalSize();

		return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
	}

	/**
	 * @param {number} containerSize
	 * @param {number} offset
	 * @param {number} overscanCount
	 * @return {{stop: number|undefined, start: number|undefined}}
	 */
	getVisibleRange(containerSize = 0, offset, overscanCount) {
		const totalSize = this.getTotalSize();

		if (totalSize === 0) {
			return {};
		}
		
		const maxOffset = Math.max(0, offset || 0) + containerSize;
		let start = this.findNearestItem(offset);
		
		if (start === undefined) {
			throw Error(`Invalid offset ${offset} specified`);
		}

		const datum = this.getSizeAndPositionForIndex(start);
		offset = datum.offset + datum.size + datum.expandSize;

		let stop = start;

		while (offset < maxOffset && stop < this.itemCount - 1) {
			stop++;
			offset += this.getSizeAndPositionForIndex(stop).size + this.getSizeAndPositionForIndex(stop).expandSize;
		}
		
		if (overscanCount) {
			start = Math.max(0, start - overscanCount);
			stop = Math.min(stop + overscanCount, this.itemCount - 1);
		}

		return {
			start,
			stop,
		};
	}

	/**
	 * Clear all cached values for items after the specified index.
	 * This method should be called for any item that has changed its size.
	 * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionForIndex() is called.
	 *
	 * @param {number} index
	 */
	resetItem(index) {
		this.lastMeasuredIndex = Math.min(this.lastMeasuredIndex, index - 1);
	}

	/**
	 * Searches for the item (index) nearest the specified offset.
	 *
	 * If no exact match is found the next lowest item index will be returned.
	 * This allows partially visible items (with offsets just before/above the fold) to be visible.
	 *
	 * @param {number} offset
	 */
	findNearestItem(offset) {
		if (isNaN(offset)) {
			throw Error(`Invalid offset ${offset} specified`);
		}

		// Our search algorithms find the nearest match at or below the specified offset.
		// So make sure the offset is at least 0 or no match will be found.
		offset = Math.max(0, offset);

		const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
		const lastMeasuredIndex = Math.max(0, this.lastMeasuredIndex);

		if (lastMeasuredSizeAndPosition.offset >= offset) {
			// If we've already measured items within this range just use a binary search as it's faster.
			return this.binarySearch({
				high: lastMeasuredIndex,
				low:  0,
				offset,
			});
		} else {
			// If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
			// The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
			// The overall complexity for this approach is O(log n).
			return this.exponentialSearch({
				index: lastMeasuredIndex,
				offset,
			});
		}
	}

	/**
	 * @private
	 * @param {number} low
	 * @param {number} high
	 * @param {number} offset
	 */
	binarySearch({ low, high, offset }) {
		let middle = 0;
		let currentOffset = 0;

		while (low <= high) {
			middle = low + Math.floor((high - low) / 2);
			currentOffset = this.getSizeAndPositionForIndex(middle).offset;

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
	exponentialSearch({ index, offset }) {
		let interval = 1;

		while (
			index < this.itemCount &&
			this.getSizeAndPositionForIndex(index).offset < offset
			) {
			index += interval;
			interval *= 2;
		}

		return this.binarySearch({
			high: Math.min(index, this.itemCount - 1),
			low:  Math.floor(index / 2),
			offset,
		});
	}
}