<script>
    export let itemid;

    let item;

    $: fetch(`/learn/items/${itemid}.json?_shape=object`)
        .then(r => r.json())
        .then(data => {
            item = data[itemid];
        });

</script>

{#if item}
<h1>{item.name}</h1>

<a href="#/item/{item.rowid}">
    <img class="h-64 w-44 mr-6 mb-6 float-left border border-purple-200 rounded-md shadow-md md:shadow-xl transform transition ease-out duration-300 hover:scale-105" 
      src={item.image} alt="">
</a>
{:else}
	<p class="loading">loading...</p>
{/if}
