import { SCROLL_CHANGE_REASON } from "./constants.js";

/**
 * Store for list state
 */

export class ListState {

    /**
     * Constructor
     * @param {Number|null|undefined} offset 
     * @param {Number} scrollChangeReason 
     */
    constructor (offset = 0, scrollChangeReason = SCROLL_CHANGE_REASON.REQUESTED) {
        this.offset = offset;
        this.scrollChangeReason = scrollChangeReason;
    };
};