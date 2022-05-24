<script>
    import { onMount } from 'svelte';
    import * as TailwindUI from "./tailwindui/index"

    import Home from "./Home.svelte"
    import SkillTree from "./SkillTree.svelte"
    import TopicList from "./TopicList.svelte"
    import TopicDetail from "./TopicDetail.svelte"
    import FormatList from "./FormatList.svelte"
    import FormatDetail from "./FormatDetail.svelte"
    import CourseList from "./CourseList.svelte"
    import ItemDetail from "./ItemDetail.svelte"
    import ItemList from "./ItemList.svelte"
    import AdvancedSearch from "./AdvancedSearch.svelte"
    import { SearchIcon, CogIcon, BookmarkAltIcon, BookmarkIcon } from "@rgossiaux/svelte-heroicons/outline";

    let currentView = "/topics";
    let randomItemId;
    let alltopics = [];

    function getRandomItemId(){
        fetch('/learn.json?_shape=array&sql=select+rowid+from+items+order+by+random()+limit+1').then(r => r.json())
        .then(data => {
            randomItemId = data[0].rowid;
        });
    }

    $: fetch(`/learn/topics.json?_shape=array&_size=5000`)
        .then(r => r.json())
        .then(data => {
            alltopics = data;
        });

	async function hashchange() {
		// the poor man's router!
		const path = window.location.hash.slice(1);

		if (path.length > 0) {
			currentView = path
		} else {
			window.location.hash = '/home';
            currentView = '/home'
		}
	}

    onMount(getRandomItemId);
	onMount(hashchange);
    

    
</script>


<svelte:window on:hashchange={hashchange}/>

<TailwindUI.AppShell>
    <svelte:fragment slot="content">
        {#if currentView === "/home" || currentView === "/"}
            <Home/>
        {:else if currentView === "/game"}
            <SkillTree/>
        {:else if currentView === "/topics"}
            <TopicList {alltopics}/>
        {:else if currentView.startsWith("/topic/")}
            <TopicDetail topicname={currentView.split("/").slice(2).join("/")} {alltopics}/>
        {:else if currentView === "/formats"}
            <FormatList/>
        {:else if currentView.startsWith("/format/")}
            <FormatDetail format={currentView.split("/")[2]} {alltopics}/>
        {:else if currentView === "/courses"}
            <CourseList/>
        {:else if currentView.startsWith("/item/")}
            <ItemDetail itemid={currentView.split("/")[2]}/>
        {:else if currentView == "/random"}
            {#if randomItemId}<ItemDetail itemid={randomItemId}/>{/if}
        {:else if currentView === "/search"}
            <AdvancedSearch/>
        {:else if currentView === "/wanttolearn"}
            <ItemList kind={0}/>
        {:else if currentView === "/finishedlearning"}
            <ItemList kind={1}/>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="nav">
        <a href="#/topics" class={(currentView === "/topics" ? 'bg-gray-900' : '') + " text-white w-full hover:bg-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"}>
            <SearchIcon class="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"/>
            Topics
        </a>
        <a href="#/formats" class={(currentView === "/formats" ? 'bg-gray-900' : '') + " text-white w-full hover:bg-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"}>
            <SearchIcon class="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"/>
            Formats
        </a>
        <a href="#/random" on:click={getRandomItemId} class="text-indigo-100 hover:bg-indigo-600 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md">
            <SearchIcon class="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"/>
            Random Item
        </a>
        <a href="#/search" class={(currentView === "/search" ? 'bg-gray-900' : '') + " text-white w-full hover:bg-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"}>
            <SearchIcon class="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"/>
            Search
        </a>
        <hr/>
        <a href="#/wanttolearn" class={(currentView === "/wanttolearn" ? 'bg-indigo-800' : '') + " text-white w-full hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"}>
            <BookmarkIcon class="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"/>
            Want to learn
        </a>
        <a href="#/finishedlearning" class={(currentView === "/finishedlearning" ? 'bg-indigo-800' : '') + " text-white w-full hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"}>
            <BookmarkAltIcon class="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"/>
            Finished learning
        </a>
        <hr/>
        <a href="/learn" class="text-indigo-100 hover:bg-indigo-600 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md">
            <CogIcon class="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"/>
            Datasette
        </a>

    </svelte:fragment>
</TailwindUI.AppShell>