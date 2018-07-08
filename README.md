# @macklinu/matches

> Simplify deep object comparisons

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/macklinu/matches.svg?branch=master)](https://travis-ci.org/macklinu/matches)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Motivation](#motivation)
- [Installation](#installation)
- [API](#api)
  - [`matches(predicateObject)`](#matchespredicateobject)
- [Tradeoffs](#tradeoffs)
- [Development](#development)
  - [`yarn`](#yarn)
  - [`yarn test`](#yarn-test)
  - [`yarn build`](#yarn-build)
  - [`yarn bench`](#yarn-bench)
- [Contributing](#contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

When writing ESLint plugins, there are a lot of deep object checking functions
like this:

```js
function isPromiseFunctionNode(node) {
  if (node.type !== 'CallExpression') {
    return false
  }
  if (node.callee.type !== 'MemberExpression') {
    return false
  }
  let propertyName = node.callee.property.name
  return propertyName === 'then' || propertyName === 'catch'
}

let nodeFromAst = {
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    property: {
      name: 'then',
    },
  },
}

isPromiseFunctionNode(nodeFromAst) // => true
```

Sometimes object properties are not present, or their values are undefined, and
you are forced to write overly defensive code as a result.

Instead, my dream is to write safe, nested object checks using a schema-like
syntax:

```js
import matches from '@macklinu/matches'

let isPromiseFunctionNode = matches({
  type: 'CallExpression',
  'callee.type': 'MemberExpression',
  'callee.property.name': /then|catch/,
})

let nodeFromAst = {
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    property: {
      name: 'then',
    },
  },
}

isPromiseFunctionNode(nodeFromAst) // => true
```

Using this library, I can write the same check in a safe, declarative way while
leveraging the power of
[regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
and predicate functions.

If you're curious to learn more, please read on and give this library a try! 🙂

## Installation

```sh
$ yarn add @macklinu/matches
```

Then import the function into your codebase:

```js
import matches from '@macklinu/matches'

// or

const matches = require('@macklinu/matches')
```

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

The `predicateObject` type is the following:

```ts
type PredicateObject = {
  [pathToKey: string]: Regexp | (value: any) => boolean | any
}
```

`predicateObject` keys are strings (the dot-separated path to a value within an
object). The corresponding values can be any of the following:

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
  'attributes.hungerLevel': 10, // out of 10
})

isHungry({ attributes: { hungerLevel: 10 } }) // => true
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

## Contributing

Feature requests, documentation updates, and questions are more than welcome
[in an issue](https://github.com/macklinu/matches/issues/new). I'm not sure what
other features or changes I'd like to make to this library at the moment but am
happy to discuss. 🙂
