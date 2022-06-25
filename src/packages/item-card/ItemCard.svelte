<script>
  import BookCard from './BookCard.svelte';
  import VideoCard from './VideoCard.svelte';
  import GenericCard from './GenericCard.svelte';
  export let item;
  export let displayType = null;
  export let showBadge = false;
</script>

{#if item.links.includes('book|') && item.links.includes('video|')}
  {#if displayType == 'video'}
    <VideoCard {item} />
  {:else}
    <BookCard {item} />
  {/if}
{:else if item.links.includes('book|')}
  <BookCard {item} />
{:else if item.links.includes('video|')}
  <VideoCard {item} />
{:else}
  <GenericCard {item} {showBadge} />
{/if}
