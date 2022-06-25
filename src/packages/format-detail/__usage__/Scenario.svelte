<script>
  import FormatDetail from '../';
  const book = {
    id: 'book',
    name: 'Books',
    image:
      'https://images.unsplash.com/photo-1524578271613-d550eacf6090?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fGJvb2tzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300',
  };
  const topics = ['Maths'];
</script>

<svelte:head>
  <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
</svelte:head>

<div class="px-8">
  <h1>❧ default</h1>
  <FormatDetail />
  <h1>❧ book</h1>
  <FormatDetail format="book" />
  <h1>❧ topics</h1>
  <FormatDetail {topics} />
</div>
