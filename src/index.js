export default function matches(predicate = {}) {
  return object => {
    if (!is.object(object)) {
      return false
    }
    return Object.keys(predicate).every(key => {
      let predicateValue = predicate[key]
      let actualValue = get(object, key)
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

function get(obj, path, fallback) {
  return (
    path.split('.').reduce((a, b) => (a && a[b] ? a[b] : null), obj) || fallback
  )
}
