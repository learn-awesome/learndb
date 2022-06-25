<script>
  import BookCard from '../item-card/BookCard.svelte';
  import VideoCard from '../item-card/VideoCard.svelte';
  import GenericCard from '../item-card/GenericCard.svelte';
  export let items = [];
  import { formats } from '../format-detail/formats.js';

  function isMobile() {
    return window.innerWidth < 680;
  }
  function getFormatDisplayName(formatName) {
    return isMobile() ? formatName.split(' ')[0] : formatName;
  }
</script>

<div class="mt-10">
  <!-- desktop view  -->
  <div class="hidden md:block">
    <sl-tab-group placement="start">
      {#each formats.filter((f) => items.filter( (x) => x.links.includes(f.id + '|') ).length > 0) as format, i}
        <sl-tab slot="nav" panel={format.id} active={i == 0} class="sticky left-0"
          >{getFormatDisplayName(format.name)}
        </sl-tab>

        {#if format.id == 'book'}
          <sl-tab-panel name={format.id} active={i == 0}>
            <div
              class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center"
            >
              {#each items.filter((x) => x.links.includes(format.id + '|')) as item}
                <BookCard {item} />
              {/each}
            </div>
          </sl-tab-panel>
        {:else if format.id == 'video'}
          <sl-tab-panel name={format.id} active={i == 0}>
            <div class="mx-auto gap-5 flex flex-wrap">
              {#each items.filter((x) => x.links.includes(format.id + '|')) as item}
                <VideoCard {item} />
              {/each}
            </div>
          </sl-tab-panel>
        {:else}
          <sl-tab-panel name={format.id} active={i == 0}>
            <div class="mx-auto gap-5 flex flex-wrap">
              {#each items.filter((x) => x.links.includes(format.id + '|')) as item}
                <GenericCard {item} />
              {/each}
            </div>
          </sl-tab-panel>
        {/if}
      {/each}
    </sl-tab-group>
  </div>

  <!-- mobile view  -->
  <div class="md:hidden">
    <sl-tab-group>
      {#each formats.filter((f) => items.filter( (x) => x.links.includes(f.id + '|') ).length > 0) as format, i}
        <sl-tab slot="nav" panel={format.id} active={i == 0}
          >{getFormatDisplayName(format.name)}
        </sl-tab>

        {#if format.id == 'book'}
          <sl-tab-panel name={format.id} active={i == 0}>
            <div class="grid gap-5 grid-cols-2 justify-items-center">
              {#each items.filter((x) => x.links.includes(format.id + '|')) as item}
                <BookCard {item} />
              {/each}
            </div>
          </sl-tab-panel>
        {:else if format.id == 'video'}
          <sl-tab-panel name={format.id} active={i == 0}>
            <div class="mx-auto gap-5 flex flex-wrap">
              {#each items.filter((x) => x.links.includes(format.id + '|')) as item}
                <VideoCard {item} />
              {/each}
            </div>
          </sl-tab-panel>
        {:else}
          <sl-tab-panel name={format.id} active={i == 0}>
            <div class="mx-auto gap-5 flex flex-wrap">
              {#each items.filter((x) => x.links.includes(format.id + '|')) as item}
                <GenericCard {item} />
              {/each}
            </div>
          </sl-tab-panel>
        {/if}
      {/each}
    </sl-tab-group>
  </div>
</div>

<!-- <div class="gap-8 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 mb-8">  
{#each items as item}
<ItemCard {item}/>
{/each}
</div> -->
