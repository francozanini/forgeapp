/* eslint-env node */

module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-console": 2,
    "@typescript-eslint/no-explicit-any": 2
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/strict",
    "prettier"
  ]
}
