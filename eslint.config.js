// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  "rules": {
    // Desactivar la regla que elimina imports no usados
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    
    // Específicamente para imports
    "unused-imports/no-unused-imports": "off"
  }
  },
]);
