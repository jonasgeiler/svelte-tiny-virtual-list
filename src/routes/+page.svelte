<script>
    import VirtualList from "$lib/components/VirtualList.svelte";

    const LIST_LENGTH = 2000;
    const LIST_HEIGHT = 600;
    const ITEM_HEIGHT = 50;

    class Row {
        constructor (index = 0) {
            this.index = index;
            this.title = "#" + (index + 1);
            this.content = (Math.floor(Math.random() * 999999999999)).toString(36);
        }
    };

    const generateFakeData = (ll = 1) => {
        const dummArray = new Array(ll);
        for(let i = 0; i < ll; i++) (dummArray[i] = new Row(i));
        return dummArray;
    };

    let virtualList = $state();

    let listLength = $state(LIST_LENGTH);

    let listHeight = $state(LIST_HEIGHT);

    let listItemSize = $state(ITEM_HEIGHT);

    let fakeData = $derived(generateFakeData(listLength));

    let scrollToIndex = $state();

    let scrollToBehaviour = $state("instant");

    const onsubmit = e => {
        e.preventDefault();
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
</script>

<main class="p-6 grid gap-6">
    <h1 class="text-xl font-extrabold">Sveltekit-tiny-virtual-list-tailwind</h1>

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
                    <span>Item size: {listItemSize}</span>
                    <input type="range" min="1" max="200" bind:value={listItemSize}/>
                </label>
                <label class="grid gap-1">
                    <span>Scroll behaviour: <code>{scrollToBehaviour}</code></span>
                    <select bind:value={scrollToBehaviour}>
                        <option value="instant">instant</option>
                        <option value="auto">auto</option>
                        <option value="smooth">smooth</option>
                    </select>
                </label>
                <div>
                    <button type="button" onclick={() => virtualList.recomputeSizes()}>Force recompute sizes</button>
                </div>
                <div>
                    <button type="button" onclick={() => (scrollToIndex = Math.floor(Math.random() * fakeData.length))}>Scroll to random index: {scrollToIndex}</button>
                </div>
            </form>
        </fieldset>
    </div>

    <div class="border-4 border-amber-500">
        <VirtualList
            bind:this={virtualList}
            width="100%"
            height={listHeight}
            itemCount={fakeData.length}
            itemSize={listItemSize}
            {scrollToIndex}
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
</main>
