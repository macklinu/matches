import matches from '.'

test.each([
  [{}, {}, true],
  [
    {
      type: 'CallExpression',
      'callee.type': 'MemberExpression',
      'callee.property.name': name => name === 'then' || name === 'catch',
    },
    {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'then',
        },
      },
    },
    true,
  ],
  [
    {
      type: 'CallExpression',
      'callee.type': 'MemberExpression',
      'callee.property.name': /then|catch/,
    },
    {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'then',
        },
      },
    },
    true,
  ],
  [
    {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: /then|catch/,
        },
      },
    },
    {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'then',
        },
      },
    },
    true,
  ],
])('matches(%p, %o) === %p', (predicate, value, expected) => {
  let isMatch = matches(predicate)
  expect(isMatch(value)).toBe(expected)
})
