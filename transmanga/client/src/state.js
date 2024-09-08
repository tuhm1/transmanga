import { createMutable } from "solid-js/store";

export const state = createMutable({
  language: localStorage.getItem("language") || "en",
  translator: localStorage.getItem("translator") || "Gemini",
  auto: true,
  images: [],
});
