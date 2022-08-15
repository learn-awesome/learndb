<script>
    import ItemList from "./ItemList.svelte"
    import TopicMasonryGrid from "./TopicMasonryGrid.svelte"
    import { io_getItemsForTopic } from "../db/jsonlines.js"

    import SearchForm from "./SearchForm.svelte"

    export let topicname;
    export let alltopics;

    let items = [];
    let filteredItems = [];

    let query = {
        text: "",
        topic: "",
        level: "",
        tag: "",
        sortby: "rating"
    };

    $: {
        let data = io_getItemsForTopic(topicname);
        items = data;
        filteredItems = data;
    }
    
    function handleQueryChanged(event){
        // console.log("queryChanged: ", event.detail);
        query = event.detail;
    }

    $:  filteredItems = items.filter(item => {
            if(query.text && !item.name.toLowerCase().includes(query.text.toLowerCase())){ return false; }
            if(query.level && item.difficulty != query.level){ return false; }
            if(query.tag && !(item.tags || []).includes(query.tag)){ return false; }
            return true;
        }).sort((a,b) => {
            if(query.sortby == 'rating') { return (a.rating - b.rating) };
            if(query.sortby == 'year') { return (a.year - b.year)};
            if(query.sortby == 'name') { return a.name.localeCompare(b.name)};
        });
    
</script>

<TopicMasonryGrid {topicname} {alltopics}/>

<div>
    <SearchForm {alltopics} on:queryChanged={handleQueryChanged} hideTopic={true} hideFormat={true}/>

    <ItemList items={filteredItems}/>
</div>


