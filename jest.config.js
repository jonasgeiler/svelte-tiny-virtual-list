module.exports = {
	transform:            {
		'^.+\\.[t|j]sx?$': 'babel-jest',
		'^.+\\.svelte$':   'svelte-jester',
	},
	moduleFileExtensions: ['js', 'svelte'],
	setupFilesAfterEnv:   ['@testing-library/jest-dom/extend-expect'],
};