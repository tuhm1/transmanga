import { For } from "solid-js";
import { TranslateImage } from "./TranslateImage";
import { state } from "./state";

export function TranslateList(props) {
  return (
    <div>
      <For each={state.images}>
        {(image) => <TranslateImage image={image} />}
      </For>
    </div>
  );
}
