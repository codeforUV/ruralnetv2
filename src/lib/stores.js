import { writable } from "svelte/store";

export const currentTest = writable({
  downloadSpeed: 0,
  uploadSpeed: 0,
  ping: 0,
  state: "not started",
  isPrevTest: false,
});

export const cookies = writable({
  accepted: null
})
