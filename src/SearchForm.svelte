<script>
  import { run, createBubbler, preventDefault } from 'svelte/legacy';

  const bubble = createBubbler();
  import { createEventDispatcher } from 'svelte';
  import Icon from "./Icon.svelte"

  /**
   * @typedef {Object} Props
   * @property {any} alltopics
   * @property {boolean} [hideTopic]
   */

  /** @type {Props} */
  let { alltopics, hideTopic = false } = $props();

  let showForm = $state(true);

  let query = $state({
    text: "",
    topic: "",
    level: "",
    sortby: "rating",
    tag: ""
  });

	const dispatch = createEventDispatcher();

  run(() => {
    dispatch('queryChanged', query);
  });

</script>

<div class="sticky z-10 top-16 bg-gradient-to-r from-lightGradOne to-lightGradTwo rounded">
  <div class="relative pt-1">
    {#if  showForm == false}
    <div class="bg-primary rounded absolute top-0 right-0">
      <button onclick={e => showForm = true} type="button" class=" p-2 text-primary_light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden">
        <span class="sr-only">Open search form</span>
        <Icon kind="search"/>
      </button>
    </div>    
    {/if}

    {#if showForm}
    <div class="bg-primary rounded absolute top-0 right-0">
      <button onclick={e => showForm = false} type="button" class="p-2 text-primary_light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden">
        <span class="sr-only">Close search form</span>
        <Icon kind="close"/>
      </button>
    </div>
    {/if}

    {#if showForm}
      <form class="w-full p-2 gap-3 mt-10 lg:mt-0 flex flex-col xl:flex-row" onsubmit={preventDefault(bubble('submit'))}>
          <sl-input type="search" placeholder="Search by keywords" size="medium" clearable class="w-full flex-1 border-0 p-0 focus:ring-0" value={query.text} onsl-input={e => query.text = e.target.value}>
            <sl-icon name="search" slot="prefix"></sl-icon>
          </sl-input>

          {#if !hideTopic}
            <fluent-combobox autocomplete="both" placeholder="Any topic" class="ml-2 mt-1 outline-none border-2 border-grey-600" onchange={e => query.topic = e.target.value}>
              {#each alltopics.sort((a,b) => (a.hname || a.name).localeCompare(b.hname || b.name)) as topic}
                <fluent-option value={topic.name}>{topic.hname || topic.name}</fluent-option>
              {/each}
            </fluent-combobox>
          {/if}

        <div class="flex flex-col md:flex-row justify-center items-center gap-3 w-full">
          <sl-select class="w-full"  onsl-change={e => query.tag = e.target.value} value={query.tag}>
            <sl-menu-item value="">Any tag</sl-menu-item>
            <sl-menu-item value="inspirational">Inspirational</sl-menu-item>
            <sl-menu-item value="educational">Educational</sl-menu-item>
            <sl-menu-item value="challenging">Challenging</sl-menu-item>
            <sl-menu-item value="entertaining">Entertaining</sl-menu-item>
            <sl-menu-item value="visual">Visual</sl-menu-item>
            <sl-menu-item value="interactive">Interactive</sl-menu-item>
            <sl-menu-item value="oer">Open (no login or pay)</sl-menu-item>
          </sl-select>

          <sl-select class="w-full"  onsl-change={e => query.level = e.target.value} value={query.level}>
            <sl-menu-item value="">Any level</sl-menu-item>
            <sl-menu-item value="childlike">Childlike</sl-menu-item>
            <sl-menu-item value="beginner">Beginner</sl-menu-item>
            <sl-menu-item value="intermediate">Intermediate</sl-menu-item>
            <sl-menu-item value="advanced">Advanced</sl-menu-item>
            <sl-menu-item value="research">Research</sl-menu-item>
          </sl-select>
        </div>

        <sl-select class="w-full md:w-1/2" onsl-change={e => query.sortby = e.target.value} value={query.sortby}>
          <sl-icon name="sort-down-alt" slot="prefix"></sl-icon>
          <sl-menu-item value="rating">Sort by Rating</sl-menu-item>
          <sl-menu-item value="year">Sort by Year</sl-menu-item>
          <sl-menu-item value="name">Sort by Name</sl-menu-item>
        </sl-select>
      </form>
    {/if} 
  </div> 
</div>
