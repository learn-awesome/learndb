<script>
    import BookCard from "./BookCard.svelte"
    import VideoCard from "./VideoCard.svelte"
    import GenericCard from "./GenericCard.svelte"
  /**
   * @typedef {Object} Props
   * @property {any} item
   * @property {any} [displayType]
   * @property {boolean} [showBadge]
   */

  /** @type {Props} */
  let { item, displayType = null, showBadge = false } = $props();
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