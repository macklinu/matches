import is from './is'
import get from './get'

export default function matches(predicate = {}) {
  return object => {
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
