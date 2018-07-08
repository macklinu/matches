import is from './is'
import get from './get'

export default function matches(predicate = {}) {
  return object => {
    return Object.keys(predicate).every(key => {
      let value = predicate[key]
      let actualValue = get(object, key)
      return is.function(value)
        ? value(actualValue)
        : is.regexp(value)
          ? value.test(actualValue)
          : value === actualValue
    })
  }
}
