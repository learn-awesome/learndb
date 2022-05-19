import { writable } from "svelte/store";

export const persistStore = (key, initial)=> {
  const persist = localStorage.getItem(key)
  const data = persist ? JSON.parse(persist) : initial

  const store = writable(data, () => {
    const unsubscribe = store.subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value))
    })
    return unsubscribe
  })
  return store
}