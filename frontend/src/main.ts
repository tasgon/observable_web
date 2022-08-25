import "./app.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

onhashchange = (ev) => {
  window.location.reload();
};

export default app;
