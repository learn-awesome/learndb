<script>
    import TopicMasonryGrid from "./TopicMasonryGrid.svelte"
    export let alltopics;
    import SearchForm from "./SearchForm.svelte"
</script>

<SearchForm {alltopics}/>

<TopicMasonryGrid {alltopics}/>
