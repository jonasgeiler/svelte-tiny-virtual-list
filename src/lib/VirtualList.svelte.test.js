import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Wrapper from './VirtualListTestWrapper.svelte';

const data = (n) => Array.from({ length: n }, (_, i) => ({ id: i, label: `Item ${i}` }));

describe('VirtualList', () => {
	it('should not render stale items when itemCount decreases', async () => {
		const rendered = [];
		const { rerender } = render(Wrapper, {
			data: data(100),
			scrollOffset: 4800,
			onItemRender: (i) => rendered.push(i)
		});

		await tick();
		rendered.length = 0;

		await rerender({ data: data(10), onItemRender: (i) => rendered.push(i) });
		await tick();

		expect(rendered.filter((i) => i >= 10)).toEqual([]);
	});
});
