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
    import AdvancedSearch from "./AdvancedSearch.svelte"
    import NavButtonWithLabel from './NavButtonWithLabel.svelte';
    import { SearchIcon, LibraryIcon, ViewGridIcon, GiftIcon, CogIcon, BookmarkAltIcon, BookmarkIcon } from "@rgossiaux/svelte-heroicons/outline";
    import Bookmarks from './Bookmarks.svelte';

    let currentView = "/topics";
    let randomItemId;
    let alltopics = [];
    let showSearch = null;

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
            <Bookmarks kind={0}/>
        {:else if currentView === "/finishedlearning"}
            <Bookmarks kind={1}/>
        {/if}

        <AdvancedSearch {showSearch} on:closed="{e => showSearch = null}"/>
    </svelte:fragment>

    <svelte:fragment slot="nav">
        <NavButtonWithLabel isActive={currentView === "/topics"} target="#/topics" label="Topics">
            <LibraryIcon class=" flex-shrink-0 h-6 w-6"/>
        </NavButtonWithLabel>

        <NavButtonWithLabel isActive={currentView === "/formats"} target="#/formats" label="Formats">
            <ViewGridIcon class=" flex-shrink-0 h-6 w-6"/>
        </NavButtonWithLabel>

        <a href="#/random" on:click={getRandomItemId} class={(currentView === "/random" ? 'bg-lightPrimCont text-lightPrimary dark:bg-darkPrimCont dark:text-darkPrimary' : '') + " text-lightSecondary1 w-full hover:bg-lightSecondary1 hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg hover:text-lightSecondary2 group flex justify-start gap-3 items-center py-5 pl-4 text-sm font-medium"}>
            <GiftIcon class=" flex-shrink-0 h-6 w-6"/>
            <h3 class="text-center"> Random Item</h3>
        </a>

        <button on:click="{e => showSearch = true}" class={(currentView === "/search" ? 'bg-lightPrimCont text-lightPrimary dark:bg-darkPrimCont dark:text-darkPrimary' : '') + "text-lightSecondary1 hover:bg-lightSecondary1 hover:text-lightSecondary2 hover:dark:text-darkSecondary2 hover:dark:bg-darkPrimaryBg w-full group flex justify-start gap-3 items-center py-5 text-sm font-medium pl-4"}>
            <SearchIcon class=" flex-shrink-0 h-6 w-6"/>
            <h3 class="text-center"> Search</h3>
        </button>

        <NavButtonWithLabel isActive={currentView === "/wanttolearn"} target="#/wanttolearn" label="Want to learn">
            <BookmarkIcon class=" flex-shrink-0 h-6 w-6"/>
        </NavButtonWithLabel>

        <NavButtonWithLabel isActive={currentView === "/finishedlearning"} target="#/finishedlearning" label="Finished learning">
            <BookmarkAltIcon class=" flex-shrink-0 h-6 w-6"/>
        </NavButtonWithLabel>
        
        <a href="/learn" target="_blank" class="text-indigo-100 hover:bg-lightSecondary1 hover:text-lightSecondary2 hover:dark:bg-darkPrimaryBg w-full group flex justify-start gap-3 items-center py-5 text-sm font-medium hover:dark:text-darkSecondary2 mb-5 pl-4">
            <CogIcon class=" flex-shrink-0 h-6 w-6 "/>
            <h3 class="text-center"> Datasette</h3>
        </a>

    </svelte:fragment>
</TailwindUI.AppShell>