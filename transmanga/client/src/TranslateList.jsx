import { For, createEffect, createSignal } from "solid-js";
import { createMutable } from "solid-js/store";
import { TranslateImage } from "./TranslateImage";
import { exportImages } from "./exportImages";

export function TranslateList(props) {
  const state = createMutable();
  const [exporting, setExporting] = createSignal(false);
  createEffect(() => {
    state.images = props.files.map((file, index) => ({ file, index }));
  });
  return (
    <div>
      <div>
        <For each={state.images}>
          {(image) => (
            <TranslateImage
              image={image}
              language={props.language}
              translator={props.translator}
            />
          )}
        </For>
      </div>
      <div>
        <button
          disabled={exporting()}
          onClick={async () => {
            setExporting(true);
            await exportImages(state.images);
            setExporting(false);
          }}
        >
          Export
        </button>
      </div>
    </div>
  );
}
