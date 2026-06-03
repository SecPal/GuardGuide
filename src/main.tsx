import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import App from "./App";
import { activateLocale, detectLocale, type Locale } from "./i18n";

const loadingMessages: Record<Locale, string> = {
  en: "Loading GuardGuide...",
  de: "GuardGuide wird geladen...",
};

export function AppWithI18n() {
  const [localeReady, setLocaleReady] = useState(false);
  const [detectedLocale] = useState(detectLocale);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        await activateLocale(detectedLocale);
        if (!isCancelled) {
          setLocaleReady(true);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to activate locale", error);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [detectedLocale]);

  if (!localeReady) {
    return (
      <div className="shell-loading" role="status" aria-live="polite">
        {loadingMessages[detectedLocale]}
      </div>
    );
  }

  return (
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  );
}

if (!import.meta.env.VITEST) {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <AppWithI18n />
    </StrictMode>
  );
}