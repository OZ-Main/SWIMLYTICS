import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
import prettier from 'eslint-config-prettier'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      ...reactHooks.configs.recommended.rules,

      // React
      'react/react-in-jsx-scope': 'off',

      // React Refresh (Vite)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // 🔥 CLEAN CODE (very important)
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Optional but useful
      'no-console': 'warn',

      // Let Prettier handle formatting
      ...prettier.rules,

      // After multiline block-shaped statements (`if`/`for`/etc. with `{ }`), require a blank line
      // before the next statement (matches CONTROL-FLOW SPACING in .cursorrules).
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
        { blankLine: 'always', prev: 'if', next: ['const', 'let', 'using'] },
      ],
    },
  },
)
