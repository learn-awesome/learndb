<script>
  import ComboBox from "./tailwindui/ComboBox.svelte"
  import { createEventDispatcher } from 'svelte';

  export let alltopics;
  export let hideTopic = false;

  let query = {
    text: "",
    topic: "",
    level: "",
    sortby: "rating",
    tag: ""
  };

	const dispatch = createEventDispatcher();

  $: dispatch('queryChanged', query);

</script>

<form class="w-full p-2 gap-3 mt-12 flex flex-col xl:flex-row" on:submit|preventDefault>
  <div class="flex flex-col md:flex-row justify-center items-center gap-3 w-full">
    <sl-input type="search" placeholder="Search by keywords" size="medium" clearable class="w-full flex-1 border-0 p-0 focus:ring-0" value={query.text} on:sl-input="{e => query.text = e.target.value}">
      <sl-icon name="search" slot="prefix"></sl-icon>
    </sl-input>

    <sl-select class="w-full md:w-2/5" on:sl-change="{e => query.sortby = e.target.value}" value={query.sortby}>
      <sl-icon name="sort-down-alt" slot="prefix"></sl-icon>
      <sl-menu-item value="rating">Sort by Rating</sl-menu-item>
      <sl-menu-item value="year">Sort by Year</sl-menu-item>
      <sl-menu-item value="name">Sort by Name</sl-menu-item>
    </sl-select>
  </div>
    

    {#if !hideTopic}
      <fluent-combobox autocomplete="both" placeholder="Any topic" class="ml-2 mt-1 outline-none border-2 border-grey-600" on:change="{e => query.topic = e.target.value}">
        {#each alltopics.sort((a,b) => a.display_name.localeCompare(b.display_name)) as topic}
          <fluent-option value={topic.name}>{topic.display_name}</fluent-option>
        {/each}
      </fluent-combobox>
    {/if}

  <div class="flex flex-col md:flex-row justify-center items-center gap-3 w-full">
    <sl-select class="w-full"  on:sl-change="{e => query.tag = e.target.value}" value={query.tag}>
      <sl-menu-item value="">Any tag</sl-menu-item>
      <sl-menu-item value="inspirational">Inspirational</sl-menu-item>
      <sl-menu-item value="educational">Educational</sl-menu-item>
      <sl-menu-item value="challenging">Challenging</sl-menu-item>
      <sl-menu-item value="entertaining">Entertaining</sl-menu-item>
      <sl-menu-item value="visual">Visual</sl-menu-item>
      <sl-menu-item value="interactive">Interactive</sl-menu-item>
      <sl-menu-item value="oer">Open (no login or pay)</sl-menu-item>
    </sl-select>

    <sl-select class="w-full"  on:sl-change="{e => query.level = e.target.value}" value={query.level}>
      <sl-menu-item value="">Any level</sl-menu-item>
      <sl-menu-item value="childlike">Childlike</sl-menu-item>
      <sl-menu-item value="beginner">Beginner</sl-menu-item>
      <sl-menu-item value="intermediate">Intermediate</sl-menu-item>
      <sl-menu-item value="advanced">Advanced</sl-menu-item>
      <sl-menu-item value="research">Research</sl-menu-item>
    </sl-select>
  </div>
</form>

