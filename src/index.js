import is from './is'
import flatten from './flatten'
import get from './get'

export default function matches(predicate = {}) {
  return object => {
    return Object.entries(flatten(predicate)).every(([key, value]) => {
      let actualValue = get(object, key)
      return is.function(value)
        ? value(actualValue)
        : is.regexp(value)
          ? value.test(actualValue)
          : value === actualValue
    })
  }
}
