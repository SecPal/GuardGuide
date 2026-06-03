import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import * as i18nModule from "./i18n";
import { AppWithI18n } from "./main";

describe("AppWithI18n", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      value: ["de-DE", "en-US"],
    });

    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "de-DE",
    });

    document.documentElement.lang = "en";
  });

  it("renders the German shell for a German browser locale", async () => {
    render(<AppWithI18n />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "GuardGuide wird geladen..."
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /GuardGuide schafft klare Anweisungen und nachvollziehbare Bestätigungen\./i,
        })
      ).toBeInTheDocument();
    });

    expect(document.documentElement.lang).toBe("de");
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
    expect(screen.getByLabelText("Shell-Informationen")).toBeInTheDocument();
  });

  it("keeps the loading state when locale activation fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.spyOn(i18nModule, "activateLocale").mockRejectedValueOnce(
      new Error("Failed to load locale")
    );

    render(<AppWithI18n />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "Failed to activate locale",
        expect.any(Error)
      );
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "GuardGuide wird geladen..."
    );
    expect(
      screen.queryByRole("heading", {
        name: /GuardGuide keeps instructions clear and acknowledgements accountable\./i,
      })
    ).not.toBeInTheDocument();
  });
});