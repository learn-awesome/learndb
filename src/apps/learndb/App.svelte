<script>
  import { onMount } from 'svelte';

  import AppShell from './AppShell.svelte';
  import Home from './Home.svelte';
  import TreeMap from '../../packages/tree-map/TreeMap.svelte';
  import TopicList from '../../packages/topic-list/TopicList.svelte';
  import TopicDetail from '../../packages/topic-detail/TopicDetail.svelte';
  import FormatList from '../../packages/format-list/FormatList.svelte';
  import FormatDetail from '../../packages/format-detail/FormatDetail.svelte';
  import ItemDetail from '../../packages/item-detail/ItemDetail.svelte';
  import Settings from '../../packages/settings-section/Settings.svelte';

  import NavButtonWithLabel from './NavButtonWithLabel.svelte';
  import {
    SearchIcon,
    LibraryIcon,
    ViewGridIcon,
    GiftIcon,
    CogIcon,
    BookmarkAltIcon,
    BookmarkIcon,
    SupportIcon,
  } from '@rgossiaux/svelte-heroicons/outline';
  import Bookmarks from '../../packages/bookmarks-section/Bookmarks.svelte';
  import {
    io_getRandomItemId,
    io_getRandomTopicName,
    io_getTopicList,
  } from '../../io/datasette.js';
  let currentView = '/topics';
  let randomTopicName;
  let randomItemId;
  let alltopics = [];

  function getRandomItemId() {
    io_getRandomItemId((d) => {
      randomItemId = d;
    });
  }

  function getRandomTopicName() {
    io_getRandomTopicName((d) => {
      randomTopicName = d;
    });
  }

  $: io_getTopicList((d) => {
    alltopics = d;
  });

  async function hashchange() {
    // the poor man's router!
    const path = window.location.hash.slice(1);

    if (path.length > 0) {
      currentView = path;
    } else {
      window.location.hash = '/home';
      currentView = '/home';
    }
  }

  onMount(getRandomItemId);
  onMount(getRandomTopicName);
  onMount(hashchange);
</script>

<svelte:window on:hashchange={hashchange} />

<AppShell>
  <svelte:fragment slot="content">
    {#if currentView === '/home' || currentView === '/'}
      <Home />
    {:else if currentView === '/map'}
      <TreeMap />
    {:else if currentView === '/topics'}
      <TopicList {alltopics} />
    {:else if currentView.startsWith('/topic/')}
      <TopicDetail topicname={currentView.split('/').slice(2).join('/')} {alltopics} />
    {:else if currentView === '/formats'}
      <FormatList />
    {:else if currentView.startsWith('/format/')}
      <FormatDetail format={currentView.split('/')[2]} {alltopics} />
    {:else if currentView.startsWith('/item/')}
      <ItemDetail itemid={currentView.split('/')[2]} />
    {:else if currentView == '/randomtopic'}
      {#if randomTopicName}<TopicDetail topicname={randomTopicName} {alltopics} />{/if}
    {:else if currentView == '/randomitem'}
      {#if randomItemId}<ItemDetail itemid={randomItemId} />{/if}
    {:else if currentView === '/wanttolearn'}
      <Bookmarks kind={0} />
    {:else if currentView === '/finishedlearning'}
      <Bookmarks kind={1} />
    {:else if currentView === '/settings'}
      <Settings />
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="nav">
    <NavButtonWithLabel isActive={currentView === '/map'} target="#/map" label="Explore the Map">
      <LibraryIcon class=" flex-shrink-0 h-6 w-6" />
    </NavButtonWithLabel>

    <NavButtonWithLabel isActive={currentView === '/topics'} target="#/topics" label="Topics">
      <LibraryIcon class=" flex-shrink-0 h-6 w-6" />
    </NavButtonWithLabel>

    <NavButtonWithLabel isActive={currentView === '/formats'} target="#/formats" label="Formats">
      <ViewGridIcon class=" flex-shrink-0 h-6 w-6" />
    </NavButtonWithLabel>

    <a
      href="#/randomtopic"
      on:click={getRandomTopicName}
      class={(currentView === '/randomtopic' ? 'text-secondary' : '') +
        ' w-full group flex justify-start gap-3 items-center py-5 pl-4 text-sm font-medium'}
    >
      <GiftIcon class=" flex-shrink-0 h-6 w-6" />
      <div class="flex flex-col items-start">
        <h3 class="text-center">Random Topic</h3>
        <div
          class={(currentView === '/randomtopic' ? 'bg-secondary w-full' : '') +
            ' w-5 mt-0.25 h-0.5 bg-primary group-hover:w-full ease-in-out duration-300'}
        />
      </div>
    </a>

    <a
      href="#/randomitem"
      on:click={getRandomItemId}
      class={(currentView === '/randomitem' ? 'text-secondary' : '') +
        '  w-full group flex justify-start gap-3 items-center py-5 pl-4 text-sm font-medium'}
    >
      <GiftIcon class=" flex-shrink-0 h-6 w-6" />
      <div class="flex flex-col items-start">
        <h3 class="text-center">Random Item</h3>
        <div
          class={(currentView === '/randomitem' ? 'bg-secondary w-full' : '') +
            ' w-5 mt-0.25 h-0.5 bg-primary group-hover:w-full ease-in-out duration-300'}
        />
      </div>
    </a>

    <NavButtonWithLabel
      isActive={currentView === '/wanttolearn'}
      target="#/wanttolearn"
      label="Want to learn"
    >
      <BookmarkIcon class=" flex-shrink-0 h-6 w-6" />
    </NavButtonWithLabel>

    <NavButtonWithLabel
      isActive={currentView === '/finishedlearning'}
      target="#/finishedlearning"
      label="Finished learning"
    >
      <BookmarkAltIcon class=" flex-shrink-0 h-6 w-6" />
    </NavButtonWithLabel>

    <!-- <NavButtonWithLabel isActive={currentView === "/settings"} target="#/settings" label="Settings">
            <CogIcon class=" flex-shrink-0 h-6 w-6"/>
        </NavButtonWithLabel> -->

    <NavButtonWithLabel target="https://github.com/learn-awesome/learndb" label="Contribute">
      <SupportIcon class=" flex-shrink-0 h-6 w-6" />
    </NavButtonWithLabel>
  </svelte:fragment>
</AppShell>
