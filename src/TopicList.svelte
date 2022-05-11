<script>
    import TopicCard from "./TopicCard.svelte"
    import Masonry from './Masonry.svelte'

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

<Masonry gridGap={'0.75rem'}>
    {#each [...hierarchy(topics).keys()] as parent}
    <div class="bg-white rounded-lg px-4 py-4 shadow-lg focus:outline-none">
        <h4 class="mt-1 p-1 text-gray-900 font-semibold text-lg">{ parent.display_name }</h4>
    
        <div class="mt-2 flex flex-wrap text-sm text-gray-900">
        {#each hierarchy(topics).get(parent) as child}
            <a href={"#/topic/" + child.id} class="text-purple-600 no-underline hover:underline hover:text-purple-900 px-2">{child.display_name}</a>
        {/each}
        </div>    
    </div>
    {/each}
</Masonry>

{:catch error}
<p>{error.message}</p>
{/await}
