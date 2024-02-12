require('@testing-library/jest-dom/extend-expect');

const { render /*, fireEvent*/ } = require('@testing-library/svelte');

const VirtualList = require('../src/VirtualList.svelte');

test('renders successfully', () => {
	const { container } = render(VirtualList, { height: 600, itemCount: 1000, itemSize: 50 });
	expect(container).toBeInTheDocument();
});

test('scrollToIndexTest', () => {
	const { container } = render(VirtualList, { height: 600, itemCount: 1000, itemSize: 50, scrollToIndex: 20 });
	expect(container).toBeInTheDocument();
});

/* TODO: Add tests */