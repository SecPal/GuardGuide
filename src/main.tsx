import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import App from "./App";
import { activateLocale, detectLocale } from "./i18n";

export function AppWithI18n() {
  const [localeReady, setLocaleReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        await activateLocale(detectLocale());
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
  }, []);

  if (!localeReady) {
    return (
      <div className="shell-loading" role="status" aria-live="polite">
        Loading GuardGuide...
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