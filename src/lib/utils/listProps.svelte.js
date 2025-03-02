export class ListProps {

    scrollToIndex = $state(-1);
    scrollToAlignment = $state("");
    scrollOffset = $state(0);
    itemCount = $state(0);
    itemSize = $state(0);
    estimatedItemSize = $state(0);
    height = $state(400);
    width = $state(400);
    stickyIndices = $state([]);

    // Default values
    previous_state = $state.raw({
        scrollToIndex: -1,
        scrollToAlignment: "start",
        scrollOffset: 0,
        itemCount: 0,
        itemSize: 0,
        estimatedItemSize: 50,
        height: 400,
        width: 400,
        stickyIndices: []
    });

    get hasScrollOffsetChanged () {
        return this.previous_state.scrollOffset !== this.scrollOffset;
    };

    get haveScrollPropsChanged () {
        return this.previous_state.scrollToIndex !== this.scrollToIndex ||
            this.previous_state.scrollToAlignment !== this.scrollToAlignment;
    };

    get haveSizesChanged () {
        return this.previous_state.itemCount !== this.itemCount ||
            this.previous_state.itemSize !== this.itemSize ||
            this.previous_state.estimatedItemSize !== this.estimatedItemSize;
    };

    get hasScrollIndexChanged () {
        return this.scrollToIndex > -1 &&
            (this.haveScrollPropsChanged || this.haveSizesChanged);
    };

    get haveDimsOrStickyIndicesChanged () {
        return this.previous_state.height !== this.height ||
            this.previous_state.width !== this.width ||
            this.previous_state.stickyIndices.toString() !== $state.snapshot(this.stickyIndices).toString()
    };

    constructor (scrollToIndex = -1, scrollToAlignment = "start", scrollOffset = 0, itemCount = 0, itemSize = 0, estimatedItemSize = 50, height = 400, width = 400, stickyIndices = []) {
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

    listen (scrollToIndex, scrollToAlignment, scrollOffset, itemCount, itemSize, estimatedItemSize, height, width, stickyIndices) {
        if (typeof scrollToIndex === "number")
            this.scrollToIndex = scrollToIndex;

        if (typeof scrollToAlignment === "string")
            this.scrollToAlignment = scrollToAlignment;

        if (typeof scrollOffset === "number")
            this.scrollOffset = scrollOffset;

        if (typeof itemCount === "number")
            this.itemCount = itemCount;

        if (typeof itemCount === "number")
            this.itemCount = itemCount;

        if (typeof itemSize === "number" || typeof itemSize === "function" || Array.isArray(itemSize))
            this.itemSize = itemSize;

        if (typeof estimatedItemSize === "number")
            this.estimatedItemSize = estimatedItemSize || this.itemSize || 50;

        if (typeof height === "number")
            this.height = height;

        if (typeof width === "number")
            this.width = width;

        if (Array.isArray(stickyIndices))
            this.stickyIndices = stickyIndices;
    };

    update () {
        this.#update_rendered_state_snapshot();
    };

    #update_rendered_state_snapshot () {
        this.previous_state = {
            scrollToIndex: $state.snapshot(this.scrollToIndex),
            scrollToAlignment: $state.snapshot(this.scrollToAlignment),
            scrollOffset: $state.snapshot(this.scrollOffset),
            itemCount: $state.snapshot(this.itemCount),
            itemSize: $state.snapshot(this.itemSize),
            estimatedItemSize: $state.snapshot(this.estimatedItemSize)
        };
    };
};