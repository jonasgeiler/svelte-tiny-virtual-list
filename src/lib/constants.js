export const ALIGNMENT = {
	AUTO:   'auto',
	START:  'start',
	CENTER: 'center',
	END:    'end',
};

export const DIRECTION = {
	HORIZONTAL: 'horizontal',
	VERTICAL:   'vertical',
};

export const SCROLL_CHANGE_REASON = {
	OBSERVED:  0,
	REQUESTED: 1,
};

export const SCROLL_PROP = {
	[DIRECTION.VERTICAL]:   'top',
	[DIRECTION.HORIZONTAL]: 'left',
};

export const SCROLL_PROP_LEGACY = {
	[DIRECTION.VERTICAL]:   'scrollTop',
	[DIRECTION.HORIZONTAL]: 'scrollLeft',
};
