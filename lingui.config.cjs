const { formatter } = require("@lingui/format-po");

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "de"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/*.d.ts"],
    },
  ],
  format: formatter({ lineNumbers: false }),
  orderBy: "messageId",
};