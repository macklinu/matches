import is from './is'
import flatten from './flatten'
import get from './get'

export default function matches(predicate = {}) {
  return object => {
    let flattened = flatten(predicate)
    return Object.keys(flattened).every(key => {
      let value = flattened[key]
      let actualValue = get(object, key)
      return is.function(value)
        ? value(actualValue)
        : is.regexp(value)
          ? value.test(actualValue)
          : value === actualValue
    })
  }
}
