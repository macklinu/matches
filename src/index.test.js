import matches from '.'

test.each([null, false, 42, 'any string', undefined, [1, 2, 3]])(
  'returns false when matching against %p',
  value => {
    const isMatch = matches({})
    expect(isMatch(value)).toBe(false)
  }
)

test('returns true when predicate and value are empty objects', () => {
  const isMatch = matches({})
  expect(isMatch({})).toBe(true)
})

test('supports predicate function matchers', () => {
  const isMatch = matches({
    type: 'CallExpression',
    'callee.type': 'MemberExpression',
    'callee.property.name': name => name === 'then' || name === 'catch',
  })

  expect(
    isMatch({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'then',
        },
      },
    })
  ).toBe(true)
})

test('supports regular expression matchers', () => {
  const isMatch = matches({
    type: 'CallExpression',
    'callee.type': 'MemberExpression',
    'callee.property.name': /then|catch/,
  })

  expect(
    isMatch({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'then',
        },
      },
    })
  ).toBe(true)
})

test('supports accessing item in array by index', () => {
  const isMatch = matches({
    type: /FunctionExpression|ArrowFunctionExpression/,
    'params.0.name': /err|error/,
  })

  expect(
    isMatch({
      type: 'FunctionExpression',
      params: [{ name: 'err' }],
    })
  ).toBe(true)
})

test('composing matchers', () => {
  const isPromiseInstanceMethod = matches({
    type: 'CallExpression',
    'callee.type': 'MemberExpression',
    'callee.property.name': /then|catch|finally/,
  })
  const isPromiseStatic = matches({
    type: 'CallExpression',
    'callee.type': 'MemberExpression',
    'callee.object.type': 'Identifier',
    'callee.object.name': 'Promise',
    'callee.property.name': /all|race|reject|resolve/,
  })
  const isPromise = node =>
    isPromiseInstanceMethod(node) || isPromiseStatic(node)

  expect(
    isPromise({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'then',
        },
      },
    })
  ).toBe(true)

  expect(
    isPromise({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'Promise',
        },
        property: {
          name: 'reject',
        },
      },
    })
  ).toBe(true)

  expect(isPromise({})).toBe(false)
})

test('advanced array checking can be done with predicate matcher', () => {
  const isMatch = matches({
    items: (items = []) =>
      items.length >= 2 && items.indexOf('apple') > 0 && items[0].price > 0,
  })

  expect(
    isMatch({
      items: [
        {
          price: 10,
          name: 'chicken',
        },
        'apple',
        'banana',
        null,
        42,
      ],
    })
  ).toBe(true)
  expect(isMatch({})).toBe(false)
})
