module.exports = {
  concurrent: false,
  linters: {
    '{README.md,CONTRIBUTING.md}': ['doctoc --maxlevel 3 --notitle', 'git add'],
    '*.js': ['eslint --fix', 'git add'],
    '*.+(json|md)': ['prettier --write', 'git add'],
  },
}
