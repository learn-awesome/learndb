<script>
    export let topicname = null; // undefined for top level
    let topic;
    export let alltopics;
    let map = new Map();

    function capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function format_topic_name(topic){
        if(topic.hname == undefined){
            return capitalize(topic);
        }
        if(topic.hname.includes("/")){
            return capitalize(topic.hname.split("/")[1]);
        } else {
            return capitalize(topic.hname);
        }
    }

    function hierarchy(topic_array, parent_id){
        let tempmap = new Map();
        // first pass to find all top-level objects
        let parentids = [];
        // console.log({topic_array}, {parent_id});
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
            tempmap.set('Misc', misc.slice(0,25));
        }

        // console.log(tempmap);
        return tempmap;
    }

    $: topic = alltopics.find(t => t.name == topicname)

    $: map = hierarchy(alltopics, topic?.name || null)


</script>

<style>
    .title::part(base) {
        font-size: 1rem;
        font-weight: bold;
        color: #1E3A8A;
}
</style>
<div class="my-2 flex flex-row">
    <sl-breadcrumb class="flex-grow">
        
        <sl-breadcrumb-item href="#/topics" class="title">All Topics</sl-breadcrumb-item>
        
        {#if topic}
            {#if topic.parent_id}
                <sl-breadcrumb-item href={"#/topic/"  + topic.parent_id}>
                    {capitalize(topic.parent_id.replace('-',' '))}
                </sl-breadcrumb-item>
            {/if}
             {#if topic.hname}
                <sl-breadcrumb-item href={"#/topic/" + topic.name}>
                    {capitalize(topic.hname.split('/').reverse()[0])}
                </sl-breadcrumb-item>
            {/if}   
        {/if}
    </sl-breadcrumb>
    <a href="https://github.com/learn-awesome/learndb" target="_blank" rel="noreferrer" class="underline text-primary hover:font-bold px-2">Help us improve this taxonomy</a>
</div>

<div class="gap-8 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 3xl:columns-5 mb-8">
  {#each [...map.entries()].sort((t1,t2) => (t1[0].sort_index || 100) - (t2[0].sort_index || 100)) as parent}
  {#if parent[0] !== 'Misc'}
    <a href={"#/topic/" + parent[0].name}>
        <div class="rounded shadow-md p-4 break-inside-avoid mb-4 border border-secondary bg-primary_light ease-in-out duration-300 hover:rounded-3xl ">
            {#if typeof(parent[0]) == "string"}
            <span class="mt-1 p-1  font-extrabold text-lg text-primary underline">{ parent[0] }</span>
            {:else}
            <div class="group inline-flex">
                <a href={"#/topic/" + parent[0].name}><span class="mt-1 p-1 text-primary font-extrabold text-lg ">{ format_topic_name(parent[0]) }</span>
                    <div class="w-5 mt-0.25 h-0.5 ml-1 bg-primary group-hover:w-full ease-in-out duration-300"></div>
                </a>
            </div>
            
            {/if}
        
            <div class="mt-2 flex flex-wrap">
            {#each parent[1].sort((t1,t2) => (t1.name.localeCompare(t2.name))) as child}
                <a href={"#/topic/" + child.name} class="text-primary no-underline hover:underline hover:underline-offset-2 px-2 ">{format_topic_name(child)}</a>
            {/each}
            </div>    
        </div>
    </a> 
    {/if}

    {#if parent[0] == 'Misc'}
    <div class="rounded-lg shadow-md p-4 break-inside-avoid mb-4 border border-secondary bg-primary_light  ease-in-out duration-300 hover:rounded-3xl">
        {#if typeof(parent[0]) == "string"}
        <span class="mt-1 p-1  font-semibold text-lg text-primary ">{ parent[0] }</span>
        {:else}
        <a href={"#/topic/" + parent[0].name}><span class="mt-1 p-1 text-primary font-extrabold text-lg ">{ format_topic_name(parent[0]) }</span></a>
        {/if}
    
        <div class="mt-2 flex flex-wrap">
        {#each parent[1].sort((t1,t2) => (t1.sort_index || 100) - (t2.sort_index || 100)) as child}
            <a href={"#/topic/" + child.name} class="text-primary no-underline hover:underline hover:underline-offset-2 px-2 ">{format_topic_name(child)}</a>
        {/each}
        </div>    
    </div>
    {/if}
  {/each}
</div>


