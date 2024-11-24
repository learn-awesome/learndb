<script>
  import { run } from 'svelte/legacy';

	import Masonry from 'svelte-bricks'
	import MasonryItem from './MasonryItem.svelte';

	let [minColWidth, maxColWidth, gap] = [300, 400, 15]
	let width = $state(), height = $state()
	

    let topic = $derived(alltopics.find(t => t.name == topicname));
  /**
   * @typedef {Object} Props
   * @property {any} [topicname] - $: items = [...Array(20).keys()] - undefined for top level
   * @property {any} alltopics
   */

  /** @type {Props} */
  let { topicname = null, alltopics } = $props();
    let map = $state(new Map());

    function capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function hierarchy(topic_array, parent){
        let tempmap = new Map();
        // first pass to find all top-level objects
        let parentids = [];
        // console.log({topic_array}, {parent});
        for(let i = 0; i < topic_array.length; i++){
            if(topic_array[i].parent == parent){
                tempmap.set(topic_array[i], []);
                parentids.push(topic_array[i].name);
            } 
        }
        // console.log(tempmap);

        // second pass for their children
        for(let i = 0; i < topic_array.length; i++){
            if(parentids.includes(topic_array[i].parent)){
                tempmap.get(topic_array.find(t => t.name == topic_array[i].parent)).push(topic_array[i])
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

    

    run(() => {
    map = hierarchy(alltopics, topic?.name || null)
  });

	let parents = $derived([...map.entries()].sort((t1,t2) => (t1[0].rank || 100) - (t2[0].rank || 100)))

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
            {#if topic.parent}
                <sl-breadcrumb-item href={"#/topic/"  + topic.parent}>
                    {capitalize(topic.parent.replace('-',' '))}
                </sl-breadcrumb-item>
            {/if}
             {#if topic.hname || topic.name}
                <sl-breadcrumb-item href={"#/topic/" + topic.name}>
                    {capitalize((topic.hname || topic.name).split('/').reverse()[0])}
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
  
  {getId}
  bind:width
  bind:height
>
 {#snippet children({ item })}
        <MasonryItem parent={item}/>
      {/snippet}
    </Masonry>
{/if}

