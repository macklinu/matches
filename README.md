# @macklinu/matches

> Simplify deep object comparisons

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
