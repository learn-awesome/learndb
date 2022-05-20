<script>
    export let item;
</script>

<a class="flex flex-col mb-8 gradient justify-center overflow-hidden" href="#/item/{item.rowid}">
  <div class="flex justify-center">
    <img class="h-64 max-w-sm object-contain py-2 mb-6 float-left rounded-md transform transition ease-out duration-300 hover:scale-105" 
      src={item.image} alt="{item.name}">
  </div>
  <sl-rating readonly precision="0.1" value={item.rating}></sl-rating>
</a>


<style>
  .gradient{
      background-color: #8BC6EC;
background-image: linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%);
  }
</style>