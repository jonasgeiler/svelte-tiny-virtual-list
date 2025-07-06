// TODO: Refactor further
export class ListState {
	/**
	 * @param {number} offset
	 * @param {number} scrollChangeReason
	 */
	constructor(offset, scrollChangeReason) {
		this.offset = $state(offset);
		this.scrollChangeReason = $state(scrollChangeReason);

		/**
		 * @typedef {object} PreviousState
		 * @property {number} offset
		 * @property {number} scrollChangeReason
		 */

		/** @type {PreviousState} */
		this.previous = $state.raw({
			offset,
			scrollChangeReason
		});
	}
	/**
	 * @param {number} [offset]
	 * @param {number} [scrollChangeReason]
	 */
	update(offset, scrollChangeReason) {
		this.offset = offset;
		this.scrollChangeReason = scrollChangeReason;
	}

	updatePrevious() {
		this.previous = {
			offset: $state.snapshot(this.offset),
			scrollChangeReason: $state.snapshot(this.scrollChangeReason)
		};
	}
}
