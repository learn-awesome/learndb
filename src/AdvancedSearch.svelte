<script>
  import { io_search_items, io_search_topics } from "../db/jsonlines.js"

  let query = '';
  let result_items = [];
  let result_topics = [];

  function resetQuery(){
    query = '';
    result_items=[];
    result_topics=[];
  }

  $: result_items = io_search_items(query);
  $: result_topics = io_search_topics(query);

</script>


<form class="hidden w-full md:pl-24 md:flex justify-center" on:submit|preventDefault>
  <div class="fixed top-2 w-full">
    <div class="transform overflow-hidden rounded-md bg-primary_light shadow-2xl ring-1 ring-black ring-opacity-5 transition-all w-2/3 mx-auto">
      <sl-input 
        placeholder="Search..." size="medium" clearable
        class="p-0"
        on:sl-input={e => query=e.target.value} 
        on:keydown={e => e.key === 'Escape' && resetQuery()} 
        on:sl-clear={resetQuery}
        value={query}
         >
        <sl-icon name="search" slot="prefix"></sl-icon>
      </sl-input>
          
      {#if result_items.length + result_topics.length > 0}    
      <sl-menu on:sl-select={e => {resetQuery(); document.location.href=e.detail.item.value; }}>
        {#if result_topics.length > 0}
        <sl-menu-label class="bg-gray-200">Topics</sl-menu-label>
          {#each result_topics as topic}
          <sl-menu-item value="#/topic/{topic.name}">{topic.display_name}</sl-menu-item>
          {/each}
        {/if}
        <sl-divider></sl-divider>
        {#if result_items.length > 0}
        <sl-menu-label class="bg-gray-200">Items</sl-menu-label>
          {#each result_items as item}
            <sl-menu-item value="#/item/{item.rowid}">{item.name}
              {#each item.links.split(";") as type} 
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