import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        SwaggerUIBundle: 'readonly',
        Redoc: 'readonly',
        autoComplete: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
]
