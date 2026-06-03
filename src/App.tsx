import { i18n } from "@lingui/core";
import { defaultLocale, locales, type Locale } from "./i18n";
import "./styles.css";

function getLocaleLabel(locale: string): string {
  if (Object.hasOwn(locales, locale)) {
    return locales[locale as Locale];
  }

  return locales[defaultLocale];
}

export default function App() {
  const activeLocale = i18n.locale || defaultLocale;

  return (
    <main className="shell">
      <section className="shell__panel">
        <p className="shell__eyebrow">
          {i18n._({
            id: "shell.eyebrow",
            message: "Standalone instruction management",
          })}
        </p>
        <h1 className="shell__title">
          {i18n._({
            id: "shell.title",
            message:
              "GuardGuide keeps instructions clear and acknowledgements accountable.",
          })}
        </h1>
        <p className="shell__body">
          {i18n._({
            id: "shell.body",
            message:
              "Launch the first standalone workspace with English source text, German localization, and a Catalyst-ready React shell.",
          })}
        </p>
        <dl
          className="shell__facts"
          aria-label={i18n._({
            id: "shell.facts.ariaLabel",
            message: "Shell facts",
          })}
        >
          <div>
            <dt>
              {i18n._({
                id: "shell.fact.locale.label",
                message: "Initial locale",
              })}
            </dt>
            <dd>{getLocaleLabel(activeLocale)}</dd>
          </div>
          <div>
            <dt>
              {i18n._({
                id: "shell.fact.catalogs.label",
                message: "Catalogs",
              })}
            </dt>
            <dd>
              {i18n._({
                id: "shell.fact.catalogs.value",
                message: "English source plus German translations",
              })}
            </dd>
          </div>
          <div>
            <dt>
              {i18n._({
                id: "shell.fact.runtime.label",
                message: "Runtime",
              })}
            </dt>
            <dd>React 19 + Vite 8 + Lingui 6</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}