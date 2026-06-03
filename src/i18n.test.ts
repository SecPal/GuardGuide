import { describe, expect, it } from "vitest";
import { detectLocale } from "./i18n";

describe("detectLocale", () => {
  it("prefers the first supported browser language", () => {
    expect(
      detectLocale({
        languages: ["de-DE", "en-US"],
        language: "en-US",
      })
    ).toBe("de");
  });

  it("falls back to English for unsupported browser languages", () => {
    expect(
      detectLocale({
        languages: ["fr-FR"],
        language: "fr-FR",
      })
    ).toBe("en");
  });

  it("falls back to English for prototype-chain locale keys", () => {
    expect(
      detectLocale({
        languages: ["constructor"],
        language: "constructor",
      })
    ).toBe("en");
  });
});