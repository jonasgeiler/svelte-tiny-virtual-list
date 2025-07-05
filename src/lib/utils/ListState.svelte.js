import { SCROLL_CHANGE_REASON } from '$lib/constants.js';

// TODO: Refactor further
export class ListState {
	offset = $state(0);
	scrollChangeReason = $state(SCROLL_CHANGE_REASON.REQUESTED);

	previousState = $state.raw({
		offset: 0,
		scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
	});

	get doRefresh() {
		return (
			this.offset !== this.previousState.offset ||
			this.scrollChangeReason !== this.previousState.scrollChangeReason
		);
	}

	get doScrollToOffset() {
		return (
			this.offset !== this.previousState.offset &&
			this.scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED
		);
	}

	constructor(offset = 0) {
		this.offset = offset;
	}

	listen(offset, scrollChangeReason) {
		if (typeof offset === 'number') this.offset = offset;

		if (typeof scrollChangeReason === 'number') this.scrollChangeReason = scrollChangeReason;
	}

	update() {
		this.#updateRenderedStateSnapshot();
	}

	#updateRenderedStateSnapshot() {
		this.previousState = {
			offset: $state.snapshot(this.offset),
			scrollChangeReason: $state.snapshot(this.scrollChangeReason)
		};
	}
}
