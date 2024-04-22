<script>
	import VirtualList from '$lib/VirtualList.svelte';
	import InfiniteLoading from 'svelte-infinite-loading';

	const api =
		'https://hn.algolia.com/api/v1/search_by_date' +
		'?tags=story' +
		`&numericFilters=created_at_i<=${Math.floor(Date.now() / 1000)}`;

	let page = 1;
	let listHeight = 0;
	let list = [];

	function infiniteHandler({ detail: { loaded, complete, error } }) {
		fetch(`${api}&page=${page}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.hits.length) {
					page += 1;
					list = [...list, ...data.hits];
					loaded();
				} else {
					complete();
				}
			})
			.catch(() => error());
	}

	function formatSite(url) {
		const domain = new URL(url).hostname;
		return domain.startsWith('www.') ? domain.slice(4) : domain;
	}

	const dateFormatter = new Intl.RelativeTimeFormat('en', { style: 'long' });
	function formatCreatedAt(createdAt) {
		const seconds = Math.floor((new Date() - new Date(createdAt)) / 1000);
		if (seconds <= 60) {
			return dateFormatter.format(-seconds, 'second');
		} else if (seconds <= 3600) {
			return dateFormatter.format(-Math.floor(seconds / 60), 'minute');
		} else if (seconds <= 86400) {
			return dateFormatter.format(-Math.floor(seconds / 3600), 'hour');
		} else if (seconds <= 604800) {
			return dateFormatter.format(-Math.floor(seconds / 86400), 'day');
		} else if (seconds <= 2592000) {
			return dateFormatter.format(-Math.floor(seconds / 604800), 'week');
		} else if (seconds <= 31536000) {
			return dateFormatter.format(-Math.floor(seconds / 2592000), 'month');
		} else {
			return dateFormatter.format(-Math.floor(seconds / 31536000), 'year');
		}
	}
</script>

<svelte:head>
	<title>Hacker News | svelte-tiny-virtual-list</title>
</svelte:head>

<header class="hacker-news-header">
	<a target="_blank" href="https://news.ycombinator.com/">
		<img src="https://news.ycombinator.com/y18.svg" alt="Logo" />
		<span>Hacker News</span>
	</a>
</header>

<div class="hacker-news-list" bind:offsetHeight={listHeight} style="height:100%">
	<VirtualList height={listHeight} itemSize={42} itemCount={list.length}>
		<div slot="item" let:index let:style {style} class="hacker-news-item" data-num={index + 1}>
			<a
				href={list[index].url || `https://news.ycombinator.com/item?id=${list[index].story_id}`}
				target="_blank">{list[index].title}</a
			>
			{#if list[index].url}
				<span>
					(<a
						href="https://news.ycombinator.com/from?site={formatSite(list[index].url)}"
						target="_blank">{formatSite(list[index].url)}</a
					>)</span
				>
			{/if}
			<p>
				{list[index].points} points by
				<a href="https://news.ycombinator.com/user?id={list[index].author}" target="_blank"
					>{list[index].author}</a
				>
				<a
					title={list[index].created_at}
					href="https://news.ycombinator.com/item?id={list[index].story_id}"
					target="_blank">{formatCreatedAt(list[index].created_at)}</a
				>
				|
				<a target="_blank" href="https://news.ycombinator.com/item?id={list[index].story_id}"
					>{list[index].num_comments} comments</a
				>
			</p>
		</div>

		<div slot="footer">
			<InfiniteLoading on:infinite={infiniteHandler} />
		</div>
	</VirtualList>
</div>

<style>
	:global(html),
	:global(body),
	:global(#app) {
		height: 100%;
	}
	:global(body) {
		font-family: Verdana, Geneva, sans-serif;
		font-size: 14px;
		padding: 28px 0 0 0;
		background-color: #f6f6ef;
	}
	.hacker-news-list {
		flex-grow: 1;
	}
	.hacker-news-list :global(.virtual-list-wrapper) {
		overflow: visible;
		overflow-x: hidden;
		white-space: nowrap;
	}
	.hacker-news-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 4px 20px;
		line-height: 14px;
		background-color: #f60;
	}
	.hacker-news-header > a {
		text-decoration: none;
	}
	.hacker-news-header > a > img {
		border: 1px solid #fff;
		vertical-align: middle;
	}
	.hacker-news-header > a > span {
		font-weight: bold;
		vertical-align: middle;
		color: #fff;
	}
	.hacker-news-item {
		padding: 10px 10px 10px 40px;
		line-height: 16px;
		font-size: 14px;
	}
	.hacker-news-item::before {
		content: attr(data-num) '.';
		float: left;
		margin-left: -40px;
		width: 32px;
		color: #888;
		text-align: right;
	}
	.hacker-news-item > a {
		color: #333;
	}
	.hacker-news-item > a:hover,
	.hacker-news-item > a:active {
		color: #000;
	}
	.hacker-news-item > a:visited {
		color: #888;
	}
	.hacker-news-item > p {
		margin: 0;
		font-size: 12px;
	}
	.hacker-news-item > span,
	.hacker-news-item > span > a,
	.hacker-news-item > p,
	.hacker-news-item > p > a {
		color: #888;
	}
	.hacker-news-item > a:not(:hover):not(:active),
	.hacker-news-item > span > a:not(:hover):not(:active),
	.hacker-news-item > p > a:not(:hover):not(:active) {
		text-decoration: none;
	}
</style>
