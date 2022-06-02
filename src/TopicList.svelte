<script>
    import TopicMasonryGrid from "./TopicMasonryGrid.svelte"
    export let alltopics;
    import SearchForm from "./SearchForm.svelte"
</script>

<div class="flex justify-end">
    <a href="#/map" class="underline hover:scale-110 px-3 py-2 hover:ease-in-out transition duration-200">Try mapview (beta)</a>
</div>
<TopicMasonryGrid {alltopics}/>
