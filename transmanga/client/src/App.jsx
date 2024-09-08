import { Show, createSignal } from "solid-js";
import { exportImages } from "./exportImages";
import { Guide } from "./Guide";
import { languages } from "./languages";
import { state } from "./state";
import { translateAuto } from "./translateAuto";
import { TranslateList } from "./TranslateList";
import { translators } from "./translators";

function App() {
  const [showGuide, setShowGuide] = createSignal(false);
  const [exporting, setExporting] = createSignal(false);
  return (
    <div style={{ "max-width": "800px", margin: "auto" }}>
      <h1>Transmanga</h1>
      <form>
        <div>
          <label>Language </label>
          <select
            value={state.language}
            onChange={(e) => {
              state.language = e.target.value;
              localStorage.setItem("language", e.target.value);
            }}
          >
            {Object.entries(languages).map(([code, label]) => (
              <option value={code}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Translator </label>
          <select
            value={state.translator}
            onChange={(e) => {
              state.translator = e.target.value;
              localStorage.setItem("translator", e.target.value);
            }}
          >
            {Object.keys(translators).map((name) => (
              <option value={name}>{name}</option>
            ))}
          </select>

          <Show when={state.translator === "Gemini"}>
            <div>
              <label>Gemini API Key</label>{" "}
              <input
                required
                onChange={(e) => pywebview.api.set_gemini_key(e.target.value)}
                autoComplete="off"
              />
              <div>
                Don't have an API Key yet? Create one for free at{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                >
                  Google AI Studio
                </a>
                .
              </div>
            </div>
          </Show>
        </div>
        <div>
          <input
            name="files"
            type="file"
            multiple
            accept="image/*"
            required
            onChange={(e) => {
              state.images = [...e.target.files].map((file) => {
                const url = URL.createObjectURL(file);
                const textBoxes = [];
                const htmlElement = document.createElement("img");
                htmlElement.src = url;
                return { file, url, textBoxes, htmlElement };
              });
            }}
          />
        </div>
        <div>
          <button type="button" onClick={() => translateAuto()}>
            Translate Auto
          </button>
        </div>
      </form>
      <div>
        <button onClick={() => setShowGuide(!showGuide())}>Guide</button>
        <Show when={showGuide()}>
          <Guide />
        </Show>
      </div>
      <TranslateList />
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

export default App;
