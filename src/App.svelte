<script>
    import { onMount } from 'svelte';
    import * as TailwindUI from "./tailwindui/index"

    import Home from "./Home.svelte"
    import TopicList from "./TopicList.svelte"
    import TopicDetail from "./TopicDetail.svelte"
    import FormatList from "./FormatList.svelte"
    import FormatDetail from "./FormatDetail.svelte"
    import CourseList from "./CourseList.svelte"
    import ItemDetail from "./ItemDetail.svelte"
    import AdvancedSearch from "./AdvancedSearch.svelte"

    let sidebarItems = [
        {text: "Topics", link: "#/topics", icon: "home"},
        {text: "Formats", link: "#/formats", icon: "home"},
        {text: "Random item", link: "#/item/1", icon: "home"},
        {text: "Search", link: "#/search", icon: "home"},
        {text: "Datasette", link: "/learn", icon: "home"}
    ]

    let currentView = "/topics";

    function handleTabChanged(event) {
        currentView = event.detail.tab;
    }

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

	onMount(hashchange);
    
</script>

<svelte:window on:hashchange={hashchange}/>

<TailwindUI.AppShell {sidebarItems}>
    {#if currentView === "/home" || currentView === "/"}
        <Home/>
    {:else if currentView === "/topics"}
        <TopicList/>
    {:else if currentView.startsWith("/topic/")}
        <TopicDetail topicid={currentView.split("/")[2]}/>
    {:else if currentView === "/formats"}
        <FormatList/>
    {:else if currentView.startsWith("/format/")}
        <FormatDetail format={currentView.split("/")[2]}/>
    {:else if currentView === "/courses"}
        <CourseList/>
    {:else if currentView.startsWith("/item/")}
        <ItemDetail itemid={currentView.split("/")[2]}/>
    {:else if currentView === "/search"}
        <AdvancedSearch/>
    {/if}
</TailwindUI.AppShell>