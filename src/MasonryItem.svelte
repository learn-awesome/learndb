<script>
	export let parent;

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
</script>

{#if parent && parent[0] !== 'Misc'}
<a href={"#/topic/" + parent[0].name}>
	<div class="rounded shadow-md p-4 break-inside-avoid border border-secondary bg-primary_light ease-in-out duration-300 hover:rounded-3xl ">
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

{#if parent && parent[0] == 'Misc'}
<div class="rounded-lg shadow-md p-4 break-inside-avoid border border-secondary bg-primary_light  ease-in-out duration-300 hover:rounded-3xl">
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