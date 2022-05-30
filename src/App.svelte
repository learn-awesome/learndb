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
    let showSearch = false;

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
        {:else if currentView === "/wanttolearn"}
            <ItemList kind={0}/>
        {:else if currentView === "/finishedlearning"}
            <ItemList kind={1}/>
        {/if}

        <AdvancedSearch {showSearch} on:closed="{e => showSearch = false}"/>
    </svelte:fragment>

    <svelte:fragment slot="nav">
        <a href="#/topics" class={(currentView === "/topics" ? 'bg-lightSecondary1 text-lightSecondary2 dark:bg-darkPrimaryBg dark:text-darkSecondary2' : '') + " text-lightSecondary1 w-full hover:bg-lightSecondary1 hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg hover:text-lightSecondary2 group flex flex-col items-center py-2 text-sm font-medium"}>
            <SearchIcon class=" flex-shrink-0 h-6 w-6"/>
            <h3 class="text-center"> Topics</h3>
        </a>
        <a href="#/formats" class={(currentView === "/formats" ? 'bg-lightSecondary1 text-lightSecondary2 dark:bg-darkPrimaryBg dark:text-darkSecondary2' : '') + " text-lightSecondary1 w-full hover:bg-lightSecondary1 hover:text-lightSecondary2 hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg group flex flex-col items-center py-2 text-sm font-medium"}>
            <SearchIcon class=" flex-shrink-0 h-6 w-6"/>
            <h3 class="text-center"> Formats</h3>
        </a>
        <a href="#/random" on:click={getRandomItemId} class="text-indigo-100 hover:bg-lightSecondary1 hover:text-lightSecondary2 hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg w-full group flex flex-col items-center py-2 text-sm font-medium">
            <SearchIcon class=" flex-shrink-0 h-6 w-6"/>
            <h3 class="text-center"> Random Item</h3>
        </a>
        <button on:click="{e => showSearch = true}" class="text-lightSecondary1 w-full hover:bg-lightSecondary1 hover:text-lightSecondary2 hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg group flex flex-col items-center py-2 text-sm font-medium">
            <SearchIcon class=" flex-shrink-0 h-6 w-6"/>
            <h3 class="text-center"> Search</h3>
        </button>
        
        <a href="#/wanttolearn" class={(currentView === "/wanttolearn" ? 'bg-lightSecondary1 text-lightSecondary2 dark:bg-darkPrimaryBg dark:text-darkSecondary2' : '') + " text-lightSecondary1 w-full hover:bg-lightSecondary1 hover:text-lightSecondary2  hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg group flex flex-col items-center py-2 text-sm font-medium"}>
            <BookmarkIcon class=" flex-shrink-0 h-6 w-6 "/>
            <h3 class="text-center"> Want to learn</h3>
        </a>
        <a href="#/finishedlearning" class={(currentView === "/finishedlearning" ? 'bg-lightSecondary1 text-lightSecondary2 dark:bg-darkPrimaryBg dark:text-darkSecondary2' : '') + " text-lightSecondary1 w-full hover:bg-lightSecondary1 hover:text-lightSecondary2  hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg group flex flex-col items-center  py-2 text-sm font-medium"}>
            <BookmarkAltIcon class=" flex-shrink-0 h-6 w-6 "/>
            <h3 class="text-center"> Finished learning</h3>
        </a>
        
        <a href="/learn" class="text-indigo-100 hover:bg-lightSecondary1 hover:text-lightSecondary2 hover:dark:bg-darkPrimaryBg w-full group flex flex-col items-center py-2 text-sm font-medium hover:dark:text-darkSecondary2">
            <CogIcon class=" flex-shrink-0 h-6 w-6 "/>
            <h3 class="text-center"> Datasette</h3>
        </a>

    </svelte:fragment>
</TailwindUI.AppShell>