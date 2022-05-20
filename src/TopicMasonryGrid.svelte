<script>
    export let topicname; // undefined for top level
    let topic;
    let alltopics = [];
    let map = new Map();

    function capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function format_topic_name(topic){
        if(topic.display_name == undefined){
            return capitalize(topic);
        }
        if(topic.display_name.includes("/")){
            return capitalize(topic.display_name.split("/")[1]);
        } else {
            return capitalize(topic.display_name);
        }
    }

    function hierarchy(topic_array, parent_id){
        let tempmap = new Map();
        // first pass to find all top-level objects
        let parentids = [];
        for(let i = 0; i < topic_array.length; i++){
            if(topic_array[i].parent_id == parent_id){
                tempmap.set(topic_array[i], []);
                parentids.push(topic_array[i].name);
            } 
        }
        // console.log(tempmap);

        // second pass for their children
        for(let i = 0; i < topic_array.length; i++){
            if(parentids.includes(topic_array[i].parent_id)){
                tempmap.get(topic_array.find(t => t.name == topic_array[i].parent_id)).push(topic_array[i])
            } 
        }
        // console.log(tempmap);

        // Now move child-less top-level objects under Misc
        let count = [...tempmap.keys()].filter(k => tempmap.get(k).length == 0).length;
        // console.log({count}, tempmap.size);
        if(count > 15){
            // console.log("pruning")
            let misc = [];
            [...tempmap.keys()].forEach(key => {
                if(tempmap.get(key).length == 0) {
                    // console.log({key});
                    misc.push(key);
                    tempmap.delete(key);
                }
            });
            tempmap.set('Misc', misc.slice(0,15));
        }

        // console.log(tempmap);
        return tempmap;
    }

    $: fetch(`/learn/topics.json?_shape=array&_size=5000`)
        .then(r => r.json())
        .then(data => {
            topic = data.find(t => t.name == topicname)
            alltopics = data;
        });

    $: map = hierarchy(alltopics, topic?.name || "")


</script>


<h1 class="text-2xl font-bold mb-4 text-gray-100">
{#if topic}
    {capitalize(topic.display_name)}
{:else}
    All Topics
{/if}
</h1>


<div class="gap-8 columns-1 sm:columns-2 lg:columns-3 mb-8">
  {#each [...map.entries()] as parent}
  <div class="rounded-lg shadow-lg p-4 break-inside-avoid mb-4 bg-cyan-900">
    <a href={"#/topic/" + parent[0]?.name || parent}><span class="mt-1 p-1 text-gray-100 font-semibold text-lg">{ format_topic_name(parent[0]) }</span></a>
  
    <div class="mt-2 flex flex-wrap text-sm text-gray-900">
    {#each parent[1] as child}
        <a href={"#/topic/" + child.name} class="text-gray-200 no-underline hover:underline hover:text-white hover:underline-offset-2 px-2 ">{format_topic_name(child)}</a>
    {/each}
    </div>    
  </div>
  {/each}
</div>


