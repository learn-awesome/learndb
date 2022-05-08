<script>
    let dataPromise = getData();
    async function getData() {
        const res = await fetch(`/learn.json?_shape=array&sql=select+distinct(substr(links%2C1%2Cinstr(links%2C'|')-1))+as+name+from+items`)
        if(res.ok){
            return await res.json();
        } else {
            throw new Error()
        }
    }

</script>

{#await dataPromise}
<p>Fetching data...</p>
{:then formats}

<div class="mt-6" style="columns: 6 240px; column-gap: 1rem;">
    {#each formats as format}
    <div tabindex="0" class="inline-block w-full mt-4 bg-white rounded-lg mt-4 px-4 py-4 shadow-lg focus:outline-none">
        <a href="#/format/{format.name}"><h4 class="mt-1 p-1 text-gray-900 font-semibold text-lg">{ format.name }</h4></a>
    
        <div class="mt-2 flex flex-wrap text-sm text-gray-900">
        </div>
    
        <p class="mt-2 text-sm text-right"><span>and 37 more.</span></p>
    
    </div>
    {/each}
</div>

{:catch error}
<p>{error.message}</p>
{/await}