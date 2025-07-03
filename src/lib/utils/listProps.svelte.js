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
    previousState = $state.raw({
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
        return this.previousState.scrollOffset !== this.scrollOffset;
    }

    get haveScrollPropsChanged () {
        return this.previousState.scrollToIndex !== this.scrollToIndex ||
            this.previousState.scrollToAlignment !== this.scrollToAlignment;
    }

    get haveSizesChanged () {
        return this.previousState.itemCount !== this.itemCount ||
            this.previousState.itemSize !== this.itemSize ||
            this.previousState.estimatedItemSize !== this.estimatedItemSize;
    }

    get hasScrollIndexChanged () {
        return this.scrollToIndex > -1 &&
            (this.haveScrollPropsChanged || this.haveSizesChanged);
    }

    get haveDimsOrStickyIndicesChanged () {
        return this.previousState.height !== this.height ||
            this.previousState.width !== this.width ||
            this.previousState.stickyIndices.toString() !== $state.snapshot(this.stickyIndices).toString()
    }

    constructor (
      scrollToIndex = -1,
      scrollToAlignment = "start",
      scrollOffset = 0,
      itemCount = 0,
      itemSize = 0,
      estimatedItemSize = 50,
      height = 400,
      width = 400,
      stickyIndices = []
    ) {
        this.scrollToIndex = scrollToIndex;
        this.scrollToAlignment = scrollToAlignment;
        this.scrollOffset = scrollOffset;
        this.itemCount = itemCount;
        this.itemSize = itemSize;
        this.estimatedItemSize = estimatedItemSize;
        this.height = height;
        this.width = width;
        this.stickyIndices = stickyIndices;
    }

    listen (
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
    }

    update () {
        this.#updateRenderedStateSnapshot();
    }

    #updateRenderedStateSnapshot () {
        this.previousState = {
            scrollToIndex: $state.snapshot(this.scrollToIndex),
            scrollToAlignment: $state.snapshot(this.scrollToAlignment),
            scrollOffset: $state.snapshot(this.scrollOffset),
            itemCount: $state.snapshot(this.itemCount),
            itemSize: $state.snapshot(this.itemSize),
            estimatedItemSize: $state.snapshot(this.estimatedItemSize)
        };
    }
}
