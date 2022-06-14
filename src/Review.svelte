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
<article class="px-3 py-4 bg-neutral_light text-neutral_dark rounded-lg text-xs w-48 max-w-sm shrink-0">
    <h3 class="font-semibold">{review.blurb.toString().slice(0,10)}...</h3>
    <p class="mt-2 line-clamp">{review.blurb}</p>
    <div class="mt-3">
        <sl-rating value={review.rating}></sl-rating>
        <span class="ml-2">...{review.by}</span>
    </div>
</article>