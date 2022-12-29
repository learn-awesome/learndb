<script>
	import Masonry from 'svelte-bricks'
	import MasonryItem from './MasonryItem.svelte';

	let [minColWidth, maxColWidth, gap] = [300, 400, 15]
	let width, height
	// $: items = [...Array(20).keys()]

    export let topicname = null; // undefined for top level
    let topic;
    export let alltopics;
    let map = new Map();

    function capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function hierarchy(topic_array, parent_name){
        let tempmap = new Map();
        // first pass to find all top-level objects
        let parentids = [];
        // console.log({topic_array}, {parent_name});
        for(let i = 0; i < topic_array.length; i++){
            if(topic_array[i].parent_name == parent_name){
                tempmap.set(topic_array[i], []);
                parentids.push(topic_array[i].name);
            } 
        }
        // console.log(tempmap);

        // second pass for their children
        for(let i = 0; i < topic_array.length; i++){
            if(parentids.includes(topic_array[i].parent_name)){
                tempmap.get(topic_array.find(t => t.name == topic_array[i].parent_name)).push(topic_array[i])
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

	$: parents = [...map.entries()].sort((t1,t2) => (t1[0].sort_index || 100) - (t2[0].sort_index || 100))

	const getId = (item) => {
		if (typeof item[0] === `object`) return item[0].name
		if (typeof item === `string`) return item
	}


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
            {#if topic.parent_name}
                <sl-breadcrumb-item href={"#/topic/"  + topic.parent_name}>
                    {capitalize(topic.parent_name.replace('-',' '))}
                </sl-breadcrumb-item>
            {/if}
             {#if topic.hname}
                <sl-breadcrumb-item href={"#/topic/" + topic.name}>
                    {capitalize(topic.hname.split('/').reverse()[0])}
                </sl-breadcrumb-item>
            {/if}   
        {/if}
    </sl-breadcrumb>
	{#if topic?.name == "programming-languages/go"}
		<sl-button href="#/roadmap/programming_in_golang" variant="success">Check out our syllabus for Golang</sl-button>
	{:else}
    	<a href="https://github.com/learn-awesome/learndb" target="_blank" rel="noreferrer" class="underline text-primary hover:font-bold px-2">Help us improve this taxonomy</a>
	{/if}
</div>

{#if parents}
<Masonry
  items={parents}
  {minColWidth}
  {maxColWidth}
  {gap}
  let:item
  {getId}
  bind:width
  bind:height
>
 <MasonryItem parent={item}/>
</Masonry>
{/if}

