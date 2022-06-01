<script>
    import ItemList from "./ItemList.svelte"
    import TopicMasonryGrid from "./TopicMasonryGrid.svelte"
   

    import SearchForm from "./SearchForm.svelte"

    export let topicname;
    export let alltopics;

    let items = [];
    let filteredItems = [];

    let query = {
        text: "",
        topic: "",
        format: "",
        level: "",
        tags: "",
        sortby: "rating"
    };

    $: fetch(`/learn/items.json?_shape=array&topics__contains=${topicname}`)
        .then(r => r.json())
        .then(data => {
            items = data;
            filteredItems = data;
        });  
    
    function handleQueryChanged(event){
        console.log("queryChanged: ", event.detail);
        query = event.detail;
    }

    $:  filteredItems = items.filter(item => {
            if(query.text && !item.name.toLowerCase().includes(query.text.toLowerCase())){ return false; }
            if(query.format && !item.links.includes(query.format)) { return false; }
            if(query.level && item.difficulty != query.level){ return false; }
            // TODO: apply tags filter
            return true;
        }).sort((a,b) => {
            if(query.sortby == 'rating') { return (a.rating - b.rating) };
            if(query.sortby == 'year') { return (a.year - b.year)};
            if(query.sortby == 'name') { return a.name.localeCompare(b.name)};
        });
    
</script>

<TopicMasonryGrid {topicname} {alltopics}/>

<SearchForm {alltopics} on:queryChanged={handleQueryChanged} hideTopic={true} hideFormat={true}/>

<ItemList items={filteredItems}/>
