<script>
    import Masonry from './Masonry.svelte'
    export let topicid; // undefined for top level
    let topic;
    let alltopics = [];
    let tree = new Map();

    function hierarchy(topics, rootid){
        // rootid can be null
        let hier = topics.reduce((map, topic) => {
            if(topic.first_parent_topic_id == rootid) {
                map.set(topic, []);
            } else {
                let parent = [...map.keys()].find(t => t.id == topic.first_parent_topic_id)
                if(parent) map.set(parent, [...map.get(parent), topic])
            }
            return map;
        }, new Map())
        
        return hier
    }

    $: fetch(`/learn/topics.json?_shape=array`)
        .then(r => r.json())
        .then(data => {
            topic = data.find(t => t.id == topicid)
            alltopics = data;
        });

    $: tree = hierarchy(alltopics, topic ? topic.id : "")

</script>

{#if topic}
<h1 class="text-2xl font-bold">{topic.display_name}</h1>
{/if}

{#if [...tree.keys()].length > 0}
<Masonry gridGap={'0.75rem'}>
  {#each [...tree.keys()] as parent}
  <div class="bg-white rounded-lg px-4 py-4 shadow-lg focus:outline-none">
    <a href={"#/topic/" + parent.id}><span class="mt-1 p-1 text-gray-900 font-semibold text-lg">{ parent.display_name }</span></a>
  
      <div class="mt-2 flex flex-wrap text-sm text-gray-900">
      {#each tree.get(parent) as child}
          <a href={"#/topic/" + child.id} class="text-purple-600 no-underline hover:underline hover:text-purple-900 px-2">{child.display_name}</a>
      {/each}
      </div>    
  </div>
  {/each}
</Masonry>
{/if}