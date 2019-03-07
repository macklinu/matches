export default function matches(predicate = {}) {
  return object => {
    if (!is.object(object)) {
      return false
    }
    return Object.keys(predicate).every(key => {
      const predicateValue = predicate[key]
      const actualValue = get(object, key)
      return equals(actualValue, predicateValue)
    })
  }
}

function equals(actual, predicate) {
  if (is.function(predicate)) {
    return predicate(actual)
  }
  if (is.regexp(predicate)) {
    return predicate.test(actual)
  }
  return predicate === actual
}

const toString = {}.toString
const type = value =>
  toString
    .call(value)
    .slice(8, -1)
    .toLowerCase()

const is = ['object', 'function', 'regexp'].reduce(
  (obj, fn) => ({ [fn]: value => type(value) === fn, ...obj }),
  {}
)

function get(obj, path, fallback) {
  return (
    path.split('.').reduce((a, b) => (a && a[b] ? a[b] : null), obj) || fallback
  )
}
