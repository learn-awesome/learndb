import "./app.postcss";
import App from "./App.svelte";
import { mount } from "svelte";

mount(App, {
  target: document.querySelector("#app"),
});
