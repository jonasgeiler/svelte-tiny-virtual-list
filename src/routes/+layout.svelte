<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	if (browser) {
		import('beercss');
	}

	let darkMode = $state(true);
	let mobileMenuOpen = $state(false);

	function handleSwitchDarkMode() {
		darkMode = !darkMode;

		localStorage.setItem('theme', darkMode ? 'dark' : 'light');

		darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark');
	};

	if (browser) {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.body.classList.add('dark');
			darkMode = true;
		} else {
			document.body.classList.remove('dark');
			darkMode = false;
		}
	}
</script>

<nav class="left drawer l">
	<header class="fixed">
		<nav>
			<i aria-hidden="true">
				<img src="{base}/logo.svg" srcset="{base}/logo.svg 2x" alt="Logo" />
			</i>
			<h6>svelte-tiny-virtual-list</h6>
		</nav>
	</header>

	<a href="/" class:active={$page.route.id === '/'}>
		<i aria-hidden="true">description</i>
		<div>README</div>
	</a>
	<a href="https://github.com/jonasgeiler/svelte-tiny-virtual-list" target="_blank">
		<i aria-hidden="true">
			<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
				/>
			</svg>
		</i>
		<div>GitHub <i aria-hidden="true" class="tiny">launch</i></div>
	</a>
	<a href="https://npmjs.com/package/svelte-tiny-virtual-list" target="_blank">
		<i aria-hidden="true">
			<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
				/>
			</svg>
		</i>
		<div>npm <i aria-hidden="true" class="tiny">launch</i></div>
	</a>

	<div class="small-divider"></div>
	<label for="">Examples</label>
	<a
		href="/examples/elements-of-equal-height"
		class:active={$page.route.id === '/examples/elements-of-equal-height'}
	>
		<i aria-hidden="true">view_headline</i>
		<div>Elements of equal height</div>
	</a>
	<a
		href="/examples/variable-heights"
		class:active={$page.route.id === '/examples/variable-heights'}
	>
		<i aria-hidden="true">view_day</i>
		<div>Variable heights</div>
	</a>
	<a href="/examples/horizontal-list" class:active={$page.route.id === '/examples/horizontal-list'}>
		<i aria-hidden="true">view_week</i>
		<div>Horizontal list</div>
	</a>
	<a href="/examples/scroll-to-index" class:active={$page.route.id === '/examples/scroll-to-index'}>
		<i aria-hidden="true">pin</i>
		<div>Scroll to index</div>
	</a>
	<a
		href="/examples/controlled-scroll-offset"
		class:active={$page.route.id === '/examples/controlled-scroll-offset'}
	>
		<i aria-hidden="true">unfold_more</i>
		<div>Controlled scroll offset</div>
	</a>

	<div class="small-divider"></div>
	<label for="">Demos</label>
	<a href="/demos/hacker-news" class:active={$page.route.id === '/demos/hacker-news'}>
		<i aria-hidden="true">newspaper</i>
		<div>Hacker News</div>
	</a>

	<div class="max"></div>
	<button class="circle border" on:click={handleSwitchDarkMode}>
		<i aria-hidden="true">{darkMode ? 'light_mode' : 'dark_mode'}</i>
	</button>
</nav>

<nav class="top s m left-align">
	<button class="circle transparent" on:click={() => (mobileMenuOpen = true)}>
		<i aria-hidden="true">menu</i>
	</button>
	<i aria-hidden="true">
		<img src="{base}/logo.svg" srcset="{base}/logo.svg 2x" alt="Logo" />
	</i>
	<h6 class="m">svelte-tiny-virtual-list</h6>
	<div class="max"></div>
	<button class="circle border" on:click={handleSwitchDarkMode}>
		<i aria-hidden="true">{darkMode ? 'light_mode' : 'dark_mode'}</i>
	</button>
</nav>
<dialog class="left s m" class:active={mobileMenuOpen}>
	<header class="fixed">
		<nav>
			<i aria-hidden="true">
				<img src="{base}/logo.svg" srcset="{base}/logo.svg 2x" alt="Logo" />
			</i>
			<h6 class="m">svelte-tiny-virtual-list</h6>
			<div class="max"></div>
			<button class="transparent circle" on:click={() => (mobileMenuOpen = false)}>
				<i aria-hidden="true">close</i>
			</button>
		</nav>
	</header>

	<nav class="drawer no-padding no-margin">
		<a href="/" class:active={$page.route.id === '/'} on:click={() => (mobileMenuOpen = false)}>
			<i aria-hidden="true">description</i>
			<div>README</div>
		</a>
		<a href="https://github.com/jonasgeiler/svelte-tiny-virtual-list" target="_blank">
			<i aria-hidden="true">
				<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
					/>
				</svg>
			</i>
			<div>GitHub <i aria-hidden="true" class="tiny">launch</i></div>
		</a>
		<a href="https://npmjs.com/package/svelte-tiny-virtual-list" target="_blank">
			<i aria-hidden="true">
				<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
					/>
				</svg>
			</i>
			<div>npm <i aria-hidden="true" class="tiny">launch</i></div>
		</a>

		<div class="small-divider"></div>
		<label for="">Examples</label>
		<a
			href="/examples/elements-of-equal-height"
			class:active={$page.route.id === '/examples/elements-of-equal-height'}
			on:click={() => (mobileMenuOpen = false)}
		>
			<i aria-hidden="true">view_headline</i>
			<div>Elements of equal height</div>
		</a>
		<a
			href="/examples/variable-heights"
			class:active={$page.route.id === '/examples/variable-heights'}
			on:click={() => (mobileMenuOpen = false)}
		>
			<i aria-hidden="true">view_day</i>
			<div>Variable heights</div>
		</a>
		<a
			href="/examples/horizontal-list"
			class:active={$page.route.id === '/examples/horizontal-list'}
			on:click={() => (mobileMenuOpen = false)}
		>
			<i aria-hidden="true">view_week</i>
			<div>Horizontal list</div>
		</a>
		<a
			href="/examples/scroll-to-index"
			class:active={$page.route.id === '/examples/scroll-to-index'}
			on:click={() => (mobileMenuOpen = false)}
		>
			<i aria-hidden="true">pin</i>
			<div>Scroll to index</div>
		</a>
		<a
			href="/examples/controlled-scroll-offset"
			class:active={$page.route.id === '/examples/controlled-scroll-offset'}
			on:click={() => (mobileMenuOpen = false)}
		>
			<i aria-hidden="true">unfold_more</i>
			<div>Controlled scroll offset</div>
		</a>

		<div class="small-divider"></div>
		<label for="">Demos</label>
		<a
			href="/demos/hacker-news"
			class:active={$page.route.id === '/demos/hacker-news'}
			on:click={() => (mobileMenuOpen = false)}
		>
			<i aria-hidden="true">newspaper</i>
			<div>Hacker News</div>
		</a>
	</nav>
</dialog>

<main id="content" class="responsive flex flex-column">
	<slot />
</main>

<style global>
	@import '../app.css';
</style>
