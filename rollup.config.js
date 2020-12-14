import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import pkg from './package.json';

const name = pkg.name
                .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
                .replace(/^\w/, m => m.toUpperCase())
                .replace(/-\w/g, m => m[1].toUpperCase());

export default {
	input:   'src/index.js',
	output:  [
		{ file: pkg.module, format: 'es' },
		{ file: pkg.main, format: 'umd', name: 'VirtualList' },
	],
	plugins: [
		svelte({ emitCss: false }),
		resolve()
	],

	/* tests
	{
		input:   'test/src/index.js',
		output:  {
			file:   'test/public/bundle.js',
			format: 'iife',
		},
		plugins: [
			resolve(),
			commonjs(),
			svelte()
		],
	},
	*/
};