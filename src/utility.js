// function for random book cover 

export function randomCover(itemid){
  let images = [
    '/book-cover.png', 
    '/book-cover-2.png',
    '/book-cover-3.png',
    '/book-cover-4.png',
    '/book-cover-5.png',
    '/book-cover-6.png',
    '/book-cover-7.png',

  ]
  return images[itemid.charCodeAt(0) % images.length];  
}