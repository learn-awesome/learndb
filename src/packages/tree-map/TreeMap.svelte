<script>
  import { onMount } from 'svelte';

  import { io_getTopicList } from '../../io';
  import { render } from './treemap.js';

  let el;

  onMount(() => {
    io_getTopicList((d) => {
      render(d, el);
    });
  });
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css?family=Open+Sans:300"
    rel="stylesheet"
    type="text/css"
  />
</svelte:head>

<div style="text-align: right;">
  <a
    href="https://github.com/learn-awesome/learndb"
    target="_blank"
    style="text-decoration:underline; padding: 2px 3px; font-weight: 700;"
    >Help us improve this taxonomy</a
  >
</div>
<p id="chart" bind:this={el} />

<style>
  #chart {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 0;
    background: #e0e7ff;
  }

  #chart :global(text) {
    cursor: pointer;
    fill: #171717;
  }

  #chart :global(.grandparent text) {
    font-weight: bold;
  }

  #chart :global(rect) {
    fill: none;
  }

  #chart :global(rect) {
    stroke-width: 2px;
  }

  #chart :global(rect) {
    fill: #f68787;
  }
  #chart :global(text) {
    font-size: 8pt;
    fill: black;
    stroke: black;
    pointer-events: none;
  }

  #chart :global(rect:hover) {
    fill: #fb3569;
  }

  #chart :global(.rect) {
    cursor: pointer;
  }
</style>
