export default (predicate = {}) => object => {
  if (!is.object(predicate)) {
    throw new TypeError('Predicate must be an object')
  }
  if (!is.object(object)) {
    throw new TypeError('Expected to check an object')
  }
  return Object.entries(flatten(predicate)).every(([key, value]) => {
    let actualValue = get(object, key)
    return is.function(value)
      ? value(actualValue)
      : is.regexp(value)
        ? value.test(actualValue)
        : value === actualValue
  })
}

let get = (obj, path, fallback = undefined) =>
  path.split('.').reduce((a, b) => (a && a[b] ? a[b] : null), obj) || fallback

let flatten = (obj, keys = []) =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(is.object(value)
        ? flatten(value, [...keys, key])
        : { [[...keys, key].join('.')]: value }),
    }),
    {}
  )

let toString = {}.toString
let type = value =>
  toString
    .call(value)
    .slice(8, -1)
    .toLowerCase()
let is = ['object', 'function', 'regexp'].reduce(
  (obj, fn) => ({ [fn]: value => type(value) === fn, ...obj }),
  {}
)
