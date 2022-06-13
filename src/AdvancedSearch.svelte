<script>
  let query = '';
  let result_items = [];
  let result_topics = [];

  function resetQuery(){
    query = '';
    result_items=[];
    result_topics=[];
  }

  $: query && fetch(`/learn/items.json?_shape=array&name__contains=${query}&_size=6`)
        .then(r => r.json())
        .then(data => {
            result_items = data;
        });

  $: query && fetch(`/learn/topics.json?_shape=array&display_name__contains=${query}&_size=6`)
        .then(r => r.json())
        .then(data => {
            result_topics = data;
        });
  

</script>


<form class="hidden w-full md:pl-24 md:flex justify-center" on:submit|preventDefault>
  <div class="fixed top-2">
    <div class="transform overflow-hidden rounded-md bg-primary_light shadow-2xl ring-1 ring-black ring-opacity-5 transition-all w-96">
      <sl-input 
        placeholder="Search..." size="medium" clearable autofocus
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
            <sl-menu-item value="#/item/{item.rowid}">{item.name}</sl-menu-item>
          {/each}
        {/if}
      </sl-menu>
      {/if}
    </div>
  </div>
</form>