<script>
    import BookCard from "./BookCard.svelte"
    import VideoCard from "./VideoCard.svelte"
    import GenericCard from "./GenericCard.svelte"
    export let item;
    export let displayType = null;
    export let showBadge = false;
</script>

{#if item.links.join(' ').includes('book|') && item.links.join(' ').includes('video|')}
  {#if displayType == 'video'}
    <VideoCard {item}/>
  {:else}
    <BookCard {item}/>
  {/if}
{:else if item.links.join(' ').includes('book|')}
  <BookCard {item}/>
{:else if item.links.join(' ').includes('video|')}
  <VideoCard {item}/>
{:else}
  <GenericCard {item} {showBadge}/>
{/if}