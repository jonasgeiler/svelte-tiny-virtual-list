import { SCROLL_CHANGE_REASON } from "$lib/constants.js";

export class ListState {

    offset = $state(0);
    scrollChangeReason = $state("");

    previous_state = $state.raw({
        offset: 0,
        scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
    });

    get doRefresh () {
        return this.offset !== this.previous_state.offset || this.scrollChangeReason !== this.previous_state.scrollChangeReason;
    };

    get doScrollToOffset () {
        return this.offset !== this.previous_state.offset && this.scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED;
    };

    constructor (offset = 0) {
        this.offset = offset;
        this.scrollChangeReason = SCROLL_CHANGE_REASON.REQUESTED;
    };

    listen (offset, scrollChangeReason) {
        if (typeof offset === "number")
            this.offset = offset;

        if (typeof scrollChangeReason === "string")
            this.scrollChangeReason = scrollChangeReason;
    };

    update () {
        this.#update_rendered_state_snapshot();
    };

    #update_rendered_state_snapshot () {
        this.previous_state = {
            offset: $state.snapshot(this.offset),
            scrollChangeReason: $state.snapshot(this.scrollChangeReason)
        };
    };
};