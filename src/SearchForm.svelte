<script>
  import ComboBox from "./tailwindui/ComboBox.svelte"
  import { createEventDispatcher } from 'svelte';

  export let alltopics;
  export let hideFormat = false;
  export let hideTopic = false;
  export let hideQuality = true;

  let query = {
    text: "",
    topic: "",
    format: "",
    level: "",
    quality: "",
    sortby: "rating",
    tag: ""
  };

	const dispatch = createEventDispatcher();

  $: dispatch('queryChanged', query);

</script>

<form class="w-full p-2 inline-flex" on:submit|preventDefault>
    <sl-input type="search" placeholder="Type something to search items by keywords" size="medium" clearable class="flex-1 border-0 p-0 focus:ring-0" value={query.text} on:sl-input="{e => query.text = e.target.value}">
      <sl-icon name="search" slot="prefix"></sl-icon>
    </sl-input>

    {#if !hideTopic}
    <ComboBox options={alltopics.map(t => { return {label: t.display_name, value: t.name}; }).sort((a,b) => a.label.localeCompare(b.label))} selected={null}/>
    {/if}

    {#if !hideFormat}
    <sl-select class="ml-2 w-44"  on:sl-change="{e => query.format = e.target.value}" value={query.format}>
      <sl-menu-item value="">Any format</sl-menu-item>
      <sl-menu-item value="book">Books</sl-menu-item>
      <sl-menu-item value="video">Videos</sl-menu-item>
      <sl-menu-item value="audio">Podcasts</sl-menu-item>
    </sl-select>
    {/if}

    <sl-select class="ml-2 w-44"  on:sl-change="{e => query.tag = e.target.value}" value={query.tag}>
      <sl-menu-item value="">Any tag</sl-menu-item>
      <sl-menu-item value="childlike">Inspirational</sl-menu-item>
      <sl-menu-item value="beginner">Educational</sl-menu-item>
      <sl-menu-item value="intermediate">Challenging</sl-menu-item>
      <sl-menu-item value="advanced">Entertaining</sl-menu-item>
      <sl-menu-item value="research">Visual</sl-menu-item>
      <sl-menu-item value="research">Interactive</sl-menu-item>
    </sl-select>

    <sl-select class="ml-2 w-44"  on:sl-change="{e => query.level = e.target.value}" value={query.level}>
      <sl-menu-item value="">Any level</sl-menu-item>
      <sl-menu-item value="childlike">Childlike</sl-menu-item>
      <sl-menu-item value="beginner">Beginner</sl-menu-item>
      <sl-menu-item value="intermediate">Intermediate</sl-menu-item>
      <sl-menu-item value="advanced">Advanced</sl-menu-item>
      <sl-menu-item value="research">Research</sl-menu-item>
    </sl-select>

    {#if !hideQuality}
    <sl-select class="ml-2 w-44"  on:sl-change="{e => query.quality = e.target.value}" value={query.quality}>
      <sl-menu-item value="">Any quality</sl-menu-item>
      <sl-menu-item value="visual">Visual</sl-menu-item>
      <sl-menu-item value="interactive">Interactive</sl-menu-item>
      <sl-menu-item value="entertaining">Entertaining</sl-menu-item>
    </sl-select>
    {/if}

    <sl-select class="ml-2 w-52" on:sl-change="{e => query.sortby = e.target.value}" value={query.sortby}>
      <sl-icon name="sort-down-alt" slot="prefix"></sl-icon>
      <sl-menu-item value="rating">Sort by Rating</sl-menu-item>
      <sl-menu-item value="year">Sort by Year</sl-menu-item>
      <sl-menu-item value="name">Sort by Name</sl-menu-item>
    </sl-select>
</form>

