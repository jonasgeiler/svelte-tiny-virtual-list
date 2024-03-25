/**
 * Store for previous list props
 */

export class ListProps {

    /**
     * Constructor
     * @param {number} scrollToIndex 
     * @param {'start' | 'center' | 'end' | 'auto'} scrollToAlignment 
     * @param {number} scrollOffset 
     * @param {number} itemCount 
     * @param {number | number[] | function} itemSize 
     * @param {number} estimatedItemSize 
     * @param {number} height 
     * @param {string} width 
     * @param {number[]} stickyIndices 
     */
    constructor (scrollToIndex = null, scrollToAlignment = null, scrollOffset = null, itemCount = 0, itemSize = 0, estimatedItemSize = 50, height = 600, width = "100%", stickyIndices = null) {
        this.scrollToIndex = scrollToIndex;
		this.scrollToAlignment = scrollToAlignment;
		this.scrollOffset = scrollOffset;
		this.itemCount = itemCount;
		this.itemSize = itemSize;
		this.estimatedItemSize = estimatedItemSize;
        this.height = height;
        this.width = width;
        this.stickyIndices = stickyIndices;
    };

    /**
     * Check if props have changed and update current object
     * @param {number} scrollOffset 
     * @param {number} scrollToIndex 
     * @param {'start' | 'center' | 'end' | 'auto'} scrollToAlignment 
     * @param {number} itemCount 
     * @param {number | number[] | function} itemSize 
     * @param {number} estimatedItemSize 
     * @param {number} height 
     * @param {string} width 
     * @param {number[]} stickyIndices 
     * @returns {Object}
     */
    havePropsChanged (scrollOffset, scrollToIndex, scrollToAlignment, itemCount, itemSize, estimatedItemSize, height, width, stickyIndices) {
        return {
            scrollOffsetHasChanged: this._hasScrollOffsetChanged(scrollOffset),
            scrollPropsHaveChanged: this._haveScrollPropsChanged(scrollToIndex, scrollToAlignment),
            itemPropsHaveChanged: this._haveItemPropsChanged(itemCount, itemSize, estimatedItemSize),
            listPropsHaveChanged: this._haveListPropsChanged(height, width, stickyIndices)
        };
    };

    /**
     * Check if scrollOffset has changed and update
     * @param {number} scrollOffset 
     * @returns {boolean}
     */
    _hasScrollOffsetChanged (scrollOffset) {
        let _tmp = false
        if(this.scrollOffset !== scrollOffset) {
            _tmp = true;
            this.scrollOffset = scrollOffset;
        }
        return _tmp;
    };

    /**
     * Check if scroll props have changed and update
     * @param {number} scrollToIndex 
     * @param {string} scrollToAlignment 
     * @returns 
     */
    _haveScrollPropsChanged (scrollToIndex, scrollToAlignment) {
        let _tmp = false
        if(this.scrollToIndex !== scrollToIndex) {
            _tmp = true;
            this.scrollToIndex = scrollToIndex;
        }
        if(this.scrollToAlignment !== scrollToAlignment) {
            _tmp = true;
            this.scrollToAlignment = scrollToAlignment;
        }
        return _tmp;
    };

    /**
     * Check if item props have changed and update
     * @param {number} itemCount 
     * @param {number | number[] | function} itemSize 
     * @param {number} estimatedItemSize 
     * @returns {boolean}
     */
    _haveItemPropsChanged (itemCount, itemSize, estimatedItemSize) {
        let _tmp = false;
        if(this.itemCount !== itemCount) {
            _tmp = true;
            this.itemCount = itemCount;
        }
        if(this.itemSize !== itemSize) {
            _tmp = true;
            this.itemSize = itemSize;
        }
        if(this.estimatedItemSize !== estimatedItemSize) {
            _tmp = true;
            this.estimatedItemSize = estimatedItemSize;
        }
        return _tmp;
    };

    /**
     * Check if list props have changed and update
     * @param {number} height 
     * @param {string} width 
     * @param {number[]} stickyIndices 
     * @returns {boolean}
     */
    _haveListPropsChanged (height, width, stickyIndices) {
        let _tmp = false;
        if(this.height !== height) {
            _tmp = true;
            this.height = height;
        }
        if(this.width !== width) {
            _tmp = true;
            this.width = width;
        }
        if(this.stickyIndices !== stickyIndices) {
            _tmp = true;
            this.stickyIndices = stickyIndices;
        }
        return _tmp;
    };
};