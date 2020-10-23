module.exports = {
  extends: 'algolia/typescript',
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'no-warning-comments': 'warn',
    'import/no-commonjs': 'off',

    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': ['error'],
  },
};
