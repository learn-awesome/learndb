import { persistStore } from "./persistStore";

 // {item_id: integer} 0 = want to learn, 1 = finished
export const bookmarks = persistStore('bookmarks', {})
export const roadmap_progress = persistStore('roadmap_progress', {})