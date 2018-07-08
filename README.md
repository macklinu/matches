# @macklinu/matches

> Simplify deep object comparisons

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/macklinu/matches.svg?branch=master)](https://travis-ci.org/macklinu/matches)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [API](#api)
  - [`matches(predicateObject)`](#matchespredicateobject)
- [Examples](#examples)
- [Tradeoffs](#tradeoffs)
- [Development](#development)
  - [`yarn`](#yarn)
  - [`yarn test`](#yarn-test)
  - [`yarn build`](#yarn-build)
  - [`yarn bench`](#yarn-bench)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## API

### `matches(predicateObject)`

Returns a function that returns a boolean.

```js
let isHuman = matches({
  type: 'human',
})

isHuman({ type: 'human' }) // => true
isHuman({ type: 'animal' }) // => false
```

The `predicateObject` parameter must be flat, meaning it can only have one level
of key-values. You can access nested objects by using dot notation like so:

```js
let isJohnDoe = matches({
  'name.first': 'John',
  'name.last': 'Doe',
})

isJohnDoe({ name: { first: 'John', last: 'Doe' } }) // => true
```

This also allows you to access and check values within an array:

```js
let isNewPromiseCallback = matches({
  type: 'ArrowFunctionExpression',
  'callee.name': 'Promise',
  'params.0.name': 'resolve',
  'params.1.name': 'reject',
})

isNewPromiseCallback({
  type: 'ArrowFunctionExpression',
  callee: { type: 'Identifier', name: 'Promise' },
  params: [
    { type: 'Identifier', name: 'resolve' },
    { type: 'Identifier', name: 'reject' },
  ],
}) // => true
```

`predicateObject` keys are strings, but values can be any of the following:

- a regular expression

```js
let isDog = matches({
  breed: /shepherd|poodle|beagle/,
})

isDog({ breed: 'poodle' }) // => true
```

- a predicate function: `(value: any) => boolean`

```js
let isLeapYear = matches({
  date: value => moment(value).isLeapYear(),
})

isLeapYear({ date: '2000-01-01' }) // => true
```

- any literal value (uses === equality checking)

```js
let isHungry = matches({
  hungry: true,
})

hasNoMoney({ hungry: true }) // => true
```

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

Use predicate functions!

```js
import matches from '@macklinu/matches'

const isPromiseFunctionNode = matches({
  type: 'CallExpression',
  'callee.type': 'MemberExpression',
  'callee.property.name': name: => name === 'then' || name === 'catch',
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
- 🤷‍♂️ Still can execute millions of times per second per the benchmark, so
  probably not a big deal unless you _really_ need blazing speeds

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
