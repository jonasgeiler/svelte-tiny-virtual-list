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

const DEFAULT_STYLE_ITEM = 'top:0;left:0;width:100%;';
export const STYLE_ITEM = DEFAULT_STYLE_ITEM + 'position:absolute;';
export const STYLE_STICKY_ITEM = DEFAULT_STYLE_ITEM + 'position:sticky;z-index:1;';

export const SCROLL_PROP = {
	[DIRECTION.VERTICAL]:   'scrollTop',
	[DIRECTION.HORIZONTAL]: 'scrollLeft',
};

export const SIZE_PROP = {
	[DIRECTION.VERTICAL]:   'height',
	[DIRECTION.HORIZONTAL]: 'width',
};

export const POSITION_PROP = {
	[DIRECTION.VERTICAL]:   'top',
	[DIRECTION.HORIZONTAL]: 'left',
};

export const MARGIN_PROP = {
	[DIRECTION.VERTICAL]:   'marginTop',
	[DIRECTION.HORIZONTAL]: 'marginLeft',
};

export const OPPOSITE_MARGIN_PROP = {
	[DIRECTION.VERTICAL]:   'marginBottom',
	[DIRECTION.HORIZONTAL]: 'marginRight',
};