// function for random book cover 

export function randomCover(itemid){
  let images = [
    '/static/book-cover.png', 
    '/static/book-cover-2.png',
    '/static/book-cover-3.png'
  ]
  return images[itemid.charCodeAt(0) % images.length];  
}