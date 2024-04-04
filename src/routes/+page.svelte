<script>
    import VirtualList from "$lib/components/VirtualList.svelte";

    const LIST_LENGTH = 20;
    const LIST_HEIGHT = 400;
    const ITEM_SIZE = 100;
    const LIST_WIDTH = 800;

    class Row {

        constructor (index = 0) {

            this.index = index;
            this.title = "#" + (index + 1);
            this.content = (Math.floor(Math.random() * 999999999999)).toString(36);

        };

    };

    const generateFakeData = (ll = 1) => {
        const dummArray = new Array(ll);

        for(let i = 0; i < ll; i++)
            dummArray[i] = new Row(i);

        return dummArray;
    };

    let innerWidth = $state(1200);

    let virtualListVertical = $state();

    let virtualListHorizontal = $state();

    let listLength = $state(LIST_LENGTH);

    let listHeight = $state(LIST_HEIGHT);

    let listWidth = $state(LIST_WIDTH);

    let listItemSize = $state(ITEM_SIZE);

    let fakeData = $derived(generateFakeData(listLength));

    let scrollToIndex = $state();

    let scrollToBehaviour = $state("instant");

    const onsubmit = e => {
        e.preventDefault();
    };

    const recomputeSizes = () => {
        virtualListVertical.recomputeSizes();
        virtualListHorizontal.recomputeSizes();
    };

    const randomBgs = [
        "bg-amber-100",
        "bg-zinc-100",
        "bg-gray-100",
        "bg-red-100",
        "bg-orange-100",
        "bg-yellow-100",
        "bg-green-100",
        "bg-teal-100",
        "bg-blue-100",
        "bg-indigo-100",
        "bg-purple-100",
        "bg-pink-100"
    ];

    const cButton = "border px-4 py-2 hover:border-amber-500";
</script>

<svelte:window bind:innerWidth/>

<main class="p-6 grid gap-6">

    <h1 class="text-xl font-extrabold">Sveltekit-tiny-virtual-list</h1>

    <div>
        <fieldset class="border p-6">
            <legend>Settings</legend>
            <form {onsubmit} class="grid gap-3">
                <label class="grid gap-1">
                    <span>Items: {listLength} </span>
                    <input type="range" min="1" max="10000" bind:value={listLength}/>
                </label>
                <label class="grid gap-1">
                    <span>Height: {listHeight}</span>
                    <input type="range" min="10" max="1000" bind:value={listHeight}/>
                </label>
                <label class="grid gap-1">
                    <span>Width: {listWidth}</span>
                    <input type="range" min="10" max="{innerWidth - 48}" bind:value={listWidth}/>
                </label>
                {#if typeof listItemSize === "number"}
                    <label class="grid gap-1">
                        <span>Item size: {listItemSize}</span>
                        <input type="range" min="1" max="200" bind:value={listItemSize}/>
                    </label>
                {/if}
                <div class="grid gap-1">
                    <span class="block">itemSize</span>
                    <div class="flex gap-2 flex-wrap">
                        <button class="{cButton}" type="button" onclick={() => (listItemSize = ITEM_SIZE)}>number</button>
                        <button class="{cButton}" type="button" onclick={() => (listItemSize = fakeData.map(() => Math.floor(Math.random() * 200)))}>number[]</button>
                        <button class="{cButton}" type="button" onclick={() => (listItemSize = (index) => Math.floor(Math.random() * index))}>function</button>
                    </div>
                </div>
                <label class="grid gap-1">
                    <span>Scroll behaviour: <code>{scrollToBehaviour}</code></span>
                    <select bind:value={scrollToBehaviour} class="{cButton}">
                        <option value="instant">instant</option>
                        <option value="auto">auto</option>
                        <option value="smooth">smooth</option>
                    </select>
                </label>
                <div>
                    <button class="{cButton}" type="button" onclick={recomputeSizes}>Force recompute sizes</button>
                </div>
                <div>
                    <button class="{cButton}" type="button" onclick={() => (scrollToIndex = Math.floor(Math.random() * fakeData.length))}>Scroll to random index: {scrollToIndex}</button>
                </div>
            </form>
        </fieldset>
    </div>

    <h2 class="font-bold">Vertical</h2>

    <div class="border-4 border-amber-500">
        <VirtualList
            bind:this={virtualListVertical}
            width="100%"
            height={listHeight}
            itemCount={fakeData.length}
            itemSize={listItemSize}
            {scrollToIndex}
            {scrollToBehaviour}
        >
            {#snippet header()}
                <header class="p-4">Header</header>
            {/snippet}
            {#snippet row({ index, style })}
                <div {style} class="p-4 {randomBgs[Math.floor(Math.random() * randomBgs.length)]}">
                    {fakeData[index].content}, Row: #{index}
                </div>
            {/snippet}
            {#snippet footer()}
                <footer class="p-4">Footer</footer>
            {/snippet}
        </VirtualList>
    </div>

    <h2 class="font-bold">Horizontal</h2>

    <div class="border-4 border-amber-500">
        <VirtualList
            bind:this={virtualListHorizontal}
            scrollDirection="horizontal"
            width={listWidth}
            height="{listHeight}px"
            itemCount={fakeData.length}
            itemSize={listItemSize}
            {scrollToIndex}
            {scrollToBehaviour}
        >
            {#snippet row({ index, style })}
                <div {style} class="p-4 {randomBgs[Math.floor(Math.random() * randomBgs.length)]}">
                    {fakeData[index].content}, Row: #{index}
                </div>
            {/snippet}
        </VirtualList>
    </div>
</main>

<style>
    .grid {
        display: grid;
    }
    .block {
        display: block;
    }
    .flex {
        display: flex;
    }
    .gap-1 {
        gap: 0.25rem;
    }
    .gap-2 {
        gap: 0.5rem;
    }
    .gap-3 {
        gap: 0.75rem;
    }
    .gap-6 {
        gap: 1.5rem;
    }
    .flex-wrap {
        flex-wrap: wrap;
    }
    .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
    .px-4 {
        padding-left: 1rem;
        padding-right: 1rem;
    }
    .p-6 {
        padding: 1.5rem;
    }
    .border {
        border-width: 1px;
        border-style: solid;
    }
    .border-4 {
        border-width: 4px;
        border-style: solid;
    }
    .hover\:border-amber-500:hover,
    .border-amber-500 {
        border-color: rgb(245 158 11 / 1);
    }
    .bg-amber-100 {
        background-color: rgb(254 243 199 / 1);
    }
    .bg-zinc-100 {
        background-color: rgb(244 244 245 / 1);
    }
    .bg-gray-100 {
        background-color: rgb(243 244 246 / 1);
    }
    .bg-red-100 {
        background-color: rgb(254 226 226 / 1);
    }
    .bg-orange-100 {
        background-color: rgb(255 237 213 / 1);
    }
    .bg-yellow-100 {
        background-color: rgb(254 249 195 / 1);
    }
    .bg-green-100 {
        background-color: rgb(220 252 231 / 1);
    }
    .bg-teal-100 {
        background-color: rgb(204 251 241 / 1);
    }
    .bg-blue-100 {
        background-color: rgb(219 234 254 / 1);
    }
    .bg-indigo-100 {
        background-color: rgb(224 231 255 / 1);
    }
    .bg-purple-100 {
        background-color: rgb(243 232 255 / 1);
    }
    .bg-pink-100 {
        background-color: rgb(252 231 243 / 1);
    }
    .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }
    .font-bold {
        font-weight: 700;
    }
    .font-extrabold {
        font-weight: 800;
    }
</style>
