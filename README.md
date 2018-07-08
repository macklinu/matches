# @macklinu/matches

> Simplify deep object comparisons

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Examples](#examples)
- [Tradeoffs](#tradeoffs)
- [Development](#development)
  - [`yarn`](#yarn)
  - [`yarn test`](#yarn-test)
  - [`yarn build`](#yarn-build)
  - [`yarn bench`](#yarn-bench)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Examples

Take this standard deep object check (e.g. writing an ESLint plugin):

```js
function isPromiseFunctionNode(node) {
  if (node.type !== 'CallExpression') {
    return false
  }
  if (node.callee.type !== 'MemberExpression') {
    return false
  }
  const propertyName = node.callee.property.name
  return propertyName === 'then' || propertyName === 'catch'
}

isPromiseFunctionNode({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    property: {
      name: 'then',
    },
  },
})
// => true
```

What if you could safely check an object with a schema-like object syntax
instead? Well now you can!

Use regular expressions!

```js
import matches from '@macklinu/matches'

const isPromiseFunctionNode = matches({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    property: {
      name: /then|catch/,
    },
  },
})

isPromiseFunctionNode({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    property: {
      name: 'then',
    },
  },
})
// => true
```

Use predicate functions!

```js
import matches from '@macklinu/matches'

const isPromiseFunctionNode = matches({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    property: {
      name: name => name === 'then' || name === 'catch',
    },
  },
})

isPromiseFunctionNode({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    property: {
      name: 'then',
    },
  },
})
// => true
```

Use a flattened object (if that's easier to read)!

```js
import matches from '@macklinu/matches'

const isPromiseFunctionNode = matches({
  type: 'CallExpression',
  'callee.type': 'MemberExpression',
  'callee.property.name': /then|catch/,
})

isPromiseFunctionNode({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    property: {
      name: 'then',
    },
  },
})
// => true
```

## Tradeoffs

- ✅ May improve clarity as an alternative to writing many if statements in a
  function
- ❌ Slower execution than a plain old function

## Development

### `yarn`

Installs dependencies

### `yarn test`

Runs Jest tests and ESLint on source files. Run `yarn watch --test` during
development for Jest's watch mode.

### `yarn build`

Compiles the code with Babel and outputs to `dist/` for publishing to npm.

### `yarn bench`

Runs benchmarks to show that, while this is a cool idea, my implementation is
magnitudes slower than just writing code like a normal human being.
