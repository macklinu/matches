import is from './is'

export default function flatten(obj = {}, keys = []) {
  return Object.keys(obj).reduce((acc, key) => {
    let value = obj[key]
    return {
      ...acc,
      ...(is.object(value)
        ? flatten(value, [...keys, key])
        : { [[...keys, key].join('.')]: value }),
    }
  }, {})
}
