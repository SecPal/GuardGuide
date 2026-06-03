import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWithI18n } from "./main";

describe("AppWithI18n", () => {
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
      "Loading GuardGuide..."
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /GuardGuide schafft klare Anweisungen und nachvollziehbare Bestatigungen\./i,
        })
      ).toBeInTheDocument();
    });

    expect(document.documentElement.lang).toBe("de");
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
  });
});