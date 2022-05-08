<script>
    import TopicCard from "./TopicCard.svelte"

    let dataPromise = getData();
    async function getData() {
        const res = await fetch(`/learn/topics.json?_shape=array`)
        if(res.ok){
            return await res.json();
        } else {
            throw new Error()
        }
    }

    function hierarchy(topics){
        return topics.reduce((map, topic) => {
            if(!topic.first_parent_topic_id) {
                map.set(topic, []);
            } else {
                let parent = topics.find(t => t.id == topic.first_parent_topic_id)
                map.set(parent, [...map.get(parent), topic])
            }
            return map;
        }, new Map())
    }
</script>

{#await dataPromise}
<p>Fetching data...</p>
{:then topics}

<div class="mt-6" style="columns: 6 240px; column-gap: 1rem;">
    {#each [...hierarchy(topics).keys()] as parent}
    <div tabindex="0" class="inline-block w-full mt-4 bg-white rounded-lg mt-4 px-4 py-4 shadow-lg focus:outline-none">
        <h4 class="mt-1 p-1 text-gray-900 font-semibold text-lg">{ parent.display_name }</h4>
    
        <div class="mt-2 flex flex-wrap text-sm text-gray-900">
        {#each hierarchy(topics).get(parent) as child}
            <a href={"#/topic/" + child.id} class="text-purple-600 no-underline hover:underline hover:text-purple-900 px-2">{child.display_name}</a>
        {/each}
        </div>
    
        <p class="mt-2 text-sm text-right"><span>and 37 more.</span></p>
    
    </div>
    {/each}
</div>

{:catch error}
<p>{error.message}</p>
{/await}
