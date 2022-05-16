<script>
    export let item;
</script>

<div class="w-80 h-min p-2 bg-pink-300 rounded-md shadow-md grid-item">
    <a href="#/item/{item.rowid}" class="aspect-video">
        <div class=" flex flex-col justify-between items-center">
            <img class="mb-6 float-left border border-purple-200 rounded-md shadow-md md:shadow-xl transform transition ease-out duration-300 hover:scale-105" 
              src={item.image} alt="{item.name}">
            <div class="flex flex-col items-start ">
                <h1>kljdl kjlkjl lkjlkj lkj l kjhjk iuyuer ouueohh hljhk</h1>
                <h2>Topics: <span>{item.topics}</span></h2>
                <span>h-64 w-44</span>
            </div>  
        </div>
    </a>
</div>

