<script>
	import readme from '../../README.md?raw';
	import { marked } from 'marked';
	import { baseUrl } from 'marked-base-url';
	import { base } from '$app/paths';
	import { gfmHeadingId } from 'marked-gfm-heading-id';

	marked.use(baseUrl(base));
	marked.use(gfmHeadingId());
	const readmeHtml = marked.parse(
		readme
			// eslint-disable-next-line no-misleading-character-class
			.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')
			.replace(/.\/static\//g, './')
	);
</script>

<svelte:head>
	<title>svelte-tiny-virtual-list</title>
</svelte:head>

<div id="readme" class="docs-page markdown-body">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html readmeHtml}
</div>

<style>
	.markdown-body {
		overflow: auto;
		font-size: 1rem;
		line-height: 1.5;
		word-wrap: break-word;
	}

	/* Text */
	:global(.markdown-body p),
	:global(.markdown-body blockquote),
	:global(.markdown-body ul),
	:global(.markdown-body ol),
	:global(.markdown-body dl),
	:global(.markdown-body table),
	:global(.markdown-body pre),
	:global(.markdown-body details) {
		margin-top: 0;
		margin-bottom: 16px;
	}

	/* Lists */
	:global(.markdown-body ul),
	:global(.markdown-body ol) {
		padding-left: 2em;
	}
	:global(.markdown-body ul ul),
	:global(.markdown-body ul ol),
	:global(.markdown-body ol ol),
	:global(.markdown-body ol ul) {
		margin-top: 0;
		margin-bottom: 0;
	}

	/* Headings */
	:global(.markdown-body h1),
	:global(.markdown-body h2),
	:global(.markdown-body h3),
	:global(.markdown-body h4),
	:global(.markdown-body h5),
	:global(.markdown-body h6) {
		margin-top: 24px;
		margin-bottom: 16px;
		font-weight: 600;
		line-height: 1.25;
	}

	/* Links */
	:global(.markdown-body a) {
		text-decoration: underline;
		text-underline-offset: 0.2rem;
		color: var(--primary);
	}

	/* Code blocks */
	:global(.markdown-body pre) {
		padding: 16px;
		overflow: auto;
		font-size: 85%;
		line-height: 1.45;
		color: var(--on-surface-variant);
		background-color: var(--surface-variant);
		border-radius: 6px;
		display: flex;
		justify-content: space-between;
	}
	:global(.markdown-body code),
	:global(.markdown-body tt) {
		padding: 0.2em 0.4em;
		margin: 0;
		font-size: 85%;
		white-space: break-spaces;
		color: var(--on-surface-variant);
		background-color: var(--surface-variant);
		border-radius: 6px;
	}
	:global(.markdown-body pre code) {
		padding: 0;
		font-size: inherit;
	}

	/* Blockquotes */
	:global(.markdown-body blockquote) {
		padding: 0 1em;
		border-left: 0.25em solid var(--primary);
	}
	:global(.markdown-body blockquote > :first-child) {
		margin-top: 0;
	}
	:global(.markdown-body blockquote > :last-child) {
		margin-bottom: 0;
	}

	/* Tables */
	:global(.markdown-body table > tbody > tr:nth-child(2n + 1)) {
		background-color: var(---stripes);
	}
	:global(.markdown-body table > tbody > tr:not(:last-child) > td) {
		border-block-end: 0.0625rem solid var(--outline);
	}

	/* Fix title alignment */
	:global(.markdown-body h2[align='center']) {
		display: block;
		text-align: center;
	}
</style>
