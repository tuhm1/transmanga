import { Show, createSignal } from "solid-js";
import { languages } from "./languages";
import { translators } from "./translators";
import { TranslateList } from "./TranslateList";
import { Guide } from "./Guide";

function App() {
  const [language, setLanguage] = createSignal(
    localStorage.getItem("language") || "en",
  );
  const [translator, setTranslator] = createSignal(
    localStorage.getItem("translator") || "Gemini",
  );
  const [showGuide, setShowGuide] = createSignal(false);
  const [submission, setSubmission] = createSignal();
  return (
    <div style={{ "max-width": "800px", margin: "auto" }}>
      <h1>Transmanga</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmission({
            language: language(),
            translator: translator(),
            files: [...e.target.files.files],
          });
        }}
      >
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

          <Show when={translator() === "Gemini"}>
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
          <input name="files" type="file" multiple accept="image/*" required />
        </div>
        <div>
          <button type="submit">Translate</button>
        </div>
      </form>
      <div>
        <button onClick={() => setShowGuide(!showGuide())}>Guide</button>
        <Show when={showGuide()}>
          <Guide />
        </Show>
      </div>
      {submission() && (
        <TranslateList
          language={submission().language}
          translator={submission().translator}
          files={submission().files}
        />
      )}
    </div>
  );
}

export default App;
