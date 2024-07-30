import { Show, createSignal } from "solid-js";
import { languages } from "./languages";
import { translators } from "./translators";
import { TranslateList } from "./TranslateList";
import { Guide } from "./Guide";

function App() {
  const [language, setLanguage] = createSignal(
    localStorage.getItem("language") || "en"
  );
  const [translator, setTranslator] = createSignal(
    localStorage.getItem("translator") || "Google"
  );
  const [files, setFiles] = createSignal([]);
  const [showGuide, setShowGuide] = createSignal(false);
  return (
    <div style={{ "max-width": "800px", margin: "auto" }}>
      <h1>Transmanga</h1>
      <form>
        <div>
          <label>Language </label>
          <select
            value={language()}
            onChange={(e) => {
              setLanguage(e.target.value);
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
            value={translator()}
            onChange={(e) => {
              setTranslator(e.target.value);
              localStorage.setItem("translator", e.target.value);
            }}
          >
            {Object.keys(translators).map((name) => (
              <option value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            required
            onChange={(e) => setFiles([...e.target.files])}
          />
        </div>
      </form>
      <div>
        <button onClick={() => setShowGuide(!showGuide())}>Guide</button>
        <Show when={showGuide()}>
          <Guide />
        </Show>
      </div>
      {files()?.length > 0 && (
        <TranslateList
          language={language()}
          translator={translator()}
          files={files()}
        />
      )}
    </div>
  );
}

export default App;
