<script>
  import { run, createBubbler, preventDefault } from 'svelte/legacy';

  const bubble = createBubbler();
  import { io_search_items, io_search_topics } from "../db/jsonlines.js"

  let query = $state('');
  let result_items = $state([]);
  let result_topics = $state([]);

  function resetQuery(){
    query = '';
    result_items=[];
    result_topics=[];
  }

  run(() => {
    result_items = io_search_items(query);
  });
  run(() => {
    result_topics = io_search_topics(query);
  });

</script>


<form class="hidden w-full md:pl-24 md:flex justify-center" onsubmit={preventDefault(bubble('submit'))}>
  <div class="absolute w-2/3 top-2">
    <div class="transform overflow-hidden rounded-md bg-primary_light shadow-2xl ring-1 ring-black ring-opacity-5 transition-all w-2/3 mx-auto">
      <sl-input 
        placeholder="Search..." size="medium" clearable
        class="p-0"
        onsl-input={e => query=e.target.value} 
        onkeydown={e => e.key === 'Escape' && resetQuery()} 
        onsl-clear={resetQuery}
        value={query}
         >
        <sl-icon name="search" slot="prefix"></sl-icon>
      </sl-input>
          
      {#if result_items.length + result_topics.length > 0}    
      <sl-menu onsl-select={e => {resetQuery(); document.location.href=e.detail.item.value; }}>
        {#if result_topics.length > 0}
        <sl-menu-label class="bg-gray-200">Topics</sl-menu-label>
          {#each result_topics as topic}
          <sl-menu-item value="#/topic/{topic.name}">{topic.hname || topic.name}</sl-menu-item>
          {/each}
        {/if}
        <sl-divider></sl-divider>
        {#if result_items.length > 0}
        <sl-menu-label class="bg-gray-200">Items</sl-menu-label>
          {#each result_items as item}
            <sl-menu-item value="#/item/{item.id}">{item.name}
              {#each item.links as type} 
                  {#if type.split("|")[0] === 'book'}
                  <sl-icon name="book" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'video'}
                  <sl-icon name="play-circle" slot="suffix"></sl-icon>
                  {/if} 
                  {#if type.split("|")[0] === 'audio'}
                  <sl-icon name="headphones" slot="suffix"></sl-icon>
                  {/if} 
                  {#if type.split("|")[0] === 'article'}
                  <sl-icon name="file-text" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'software'}
                  <sl-icon name="app" slot="suffix"></sl-icon>
                  {/if} 
                  {#if type.split("|")[0] === 'blogs'}
                  <span slot="suffix">b</span>
                  {/if}
                  {#if type.split("|")[0] === 'forums'}
                  <sl-icon name="chat-dots" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'cheatsheets'}
                  <sl-icon name="list-columns-reverse" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'code'}
                  <sl-icon name="code" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'conferences'}
                  <sl-icon name="people" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'course'}
                  <sl-icon name="lightbulb" slot="suffix"></sl-icon>
                  {/if}               
                  {#if type.split("|")[0] === 'flashcard'}
                  <sl-icon name="postcard" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'games'}
                  <sl-icon name="controller" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'infographics'}
                  <sl-icon name="images" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'people'}
                  <sl-icon name="person-circle" slot="suffix"></sl-icon>
                  {/if}
                  {#if type.split("|")[0] === 'wiki'}
                  <sl-icon name="globe2" slot="suffix"></sl-icon>
                  {/if}
                {/each}
            </sl-menu-item>
          {/each}
        {/if}
      </sl-menu>
      {/if}
    </div>
  </div>
</form>