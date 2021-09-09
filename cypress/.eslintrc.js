module.exports = {
  "env": {
    "cypress/globals": true,
    "node": true
  },
  "extends": [
    "../.eslintrc.js",
    "plugin:cypress/recommended",
    "plugin:chai-friendly/recommended"
  ],
  "plugins": [
    "cypress",
    "chai-friendly",
  ],
  // Refer: https://github.com/cypress-io/eslint-plugin-cypress#rules
  "rules": {
    "no-force": "error",
    "assertion-before-screenshot": "error",
    "require-data-selectors": "error",
  }
}
