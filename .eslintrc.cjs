module.exports = {
  extends: ['@rocketseat/eslint-config/react'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'off',
    'simple-import-sort/exports': 'off',
    'no-unused-vars': 'off',
    'eqeqeq': 'off',
    'no-unescaped-entities': 'off',
    'no-explicit-any': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'no-nested-ternary': 'error',
  },
  overrides: [
    {
      files: ['src/components/ui/**', 'src/lib/axios.ts'],
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
      },
    },
  ],
}
