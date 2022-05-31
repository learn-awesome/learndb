<script>
    export let topicname; // undefined for top level
    let topic;
    export let alltopics;
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

    $: topic = alltopics.find(t => t.name == topicname)

    $: map = hierarchy(alltopics, topic?.name || "")


</script>

<div class="my-2 text-lightButton2">
    <sl-breadcrumb>
        <sl-breadcrumb-item href="#/topics" class="text-lg">All Topics</sl-breadcrumb-item>
        {#if topic}
            {#if topic.parent_id}
                <sl-breadcrumb-item href={"#/topic/"  + topic.parent_id}>
                    {capitalize(topic.parent_id)}
                </sl-breadcrumb-item>
            {/if}
             {#if topic.display_name}
                <sl-breadcrumb-item href={"#/topic/" + topic.name}>
                    {capitalize(topic.display_name)}
                </sl-breadcrumb-item>
            {/if}   
        {/if}
    </sl-breadcrumb>
</div>

<div class="gap-8 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 mb-8">
  {#each [...map.entries()].sort((t1,t2) => (t1[0].sort_index || 100) - (t2[0].sort_index || 100)) as parent}
    <a href={"#/topic/" + parent[0].name}>
        <div class="rounded-lg shadow-md p-4 break-inside-avoid mb-4 border-8 border-lightPrimCont dark:border-darkPrimCont hover:bg-lightPrimCont dark:bg-darkPrimCont ">
            {#if typeof(parent[0]) == "string"}
            <span class="mt-1 p-1  font-semibold text-lg">{ parent[0] }</span>
            {:else}
            <a href={"#/topic/" + parent[0].name}><span class="mt-1 p-1 text-lightPrimary dark:text-darkPrimary hover:text-lightSecondary dark:hover:text-darkSecondary text-lg ">{ format_topic_name(parent[0]) }</span></a>
            {/if}
        
            <div class="mt-2 flex flex-wrap text-sm text-gray-900">
            {#each parent[1].sort((t1,t2) => (t1.sort_index || 100) - (t2.sort_index || 100)) as child}
                <a href={"#/topic/" + child.name} class="text-lightSecondary2 dark:text-darkSecondary2 no-underline hover:underline hover:underline-offset-2 px-2 ">{format_topic_name(child)}</a>
            {/each}
            </div>    
        </div>
    </a> 
  {/each}
</div>


