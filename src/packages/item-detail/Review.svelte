<script lang="ts">
    export let review: any;
</script>

<style>
 .line-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
</style>
<article class="px-3 py-4 bg-neutral_light text-neutral_dark rounded-lg text-xs w-48 max-w-sm shrink-0 md:w-full">
    <h3 class="font-semibold">{review.blurb.toString().slice(0,10)}...</h3>
    <p class="mt-2 line-clamp">{review.blurb}</p>
    <div class="mt-3 flex flex-col">
        {#if review.rating}
        <sl-rating readonly value={review.rating}></sl-rating>
        {/if}
        <span class="font-bold">{review.by}</span>
    </div>
</article>