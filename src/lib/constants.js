export const ALIGNMENT = /** @type {const} */ ({
	AUTO: 'auto',
	START: 'start',
	CENTER: 'center',
	END: 'end'
});

export const DIRECTION = /** @type {const} */ ({
	HORIZONTAL: 'horizontal',
	VERTICAL: 'vertical'
});

export const SCROLL_CHANGE_REASON = {
	OBSERVED: 0,
	REQUESTED: 1
};

export const SCROLL_PROP = /** @type {const} */ ({
	[DIRECTION.VERTICAL]: 'top',
	[DIRECTION.HORIZONTAL]: 'left'
});

export const SCROLL_PROP_LEGACY = /** @type {const} */ ({
	[DIRECTION.VERTICAL]: 'scrollTop',
	[DIRECTION.HORIZONTAL]: 'scrollLeft'
});
