import matches from '.'

test.each([null, false, 42, 'any string', undefined, [1, 2, 3]])(
  'returns false when matching against %p',
  value => {
    let isMatch = matches({})
    expect(isMatch(value)).toBe(false)
  }
)

test('returns true when predicate and value are empty objects', () => {
  let isMatch = matches({})
  expect(isMatch({})).toBe(true)
})

test('supports predicate function matchers', () => {
  let isMatch = matches({
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
  let isMatch = matches({
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
  let isMatch = matches({
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
