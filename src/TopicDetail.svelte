<script>
    import { run } from 'svelte/legacy';

    import ItemList from "./ItemList.svelte"
    import TopicMasonryGrid from "./TopicMasonryGrid.svelte"
    import { io_getItemsForTopic } from "../db/jsonlines.js"

    import SearchForm from "./SearchForm.svelte"

    let { topicname, alltopics } = $props();

    let items = $state([]);
    let filteredItems = $state([]);

    let query = $state({
        text: "",
        topic: "",
        level: "",
        tag: "",
        sortby: "rating"
    });

    run(() => {
        let data = io_getItemsForTopic(topicname);
        items = data;
        filteredItems = data;
    });
    
    function handleQueryChanged(event){
        // console.log("queryChanged: ", event.detail);
        query = event.detail;
    }

    run(() => {
        filteredItems = items.filter(item => {
                if(query.text && !item.name.toLowerCase().includes(query.text.toLowerCase())){ return false; }
                if(query.level && item.difficulty != query.level){ return false; }
                if(query.tag && !(item.tags || []).includes(query.tag)){ return false; }
                return true;
            }).sort((a,b) => {
                if(query.sortby == 'rating') { return ((a.rating || 0) - (b.rating || 0)) };
                if(query.sortby == 'year') { return (a.year - b.year)};
                if(query.sortby == 'name') { return a.name.localeCompare(b.name)};
            });
    });
    
</script>

<TopicMasonryGrid {topicname} {alltopics}/>

<div>
    <SearchForm {alltopics} on:queryChanged={handleQueryChanged} hideTopic={true} hideFormat={true}/>

    <ItemList items={filteredItems}/>
</div>


