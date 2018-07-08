import is from './is'

export default function flatten(obj, keys = []) {
  return Object.entries(obj || {}).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(is.object(value)
        ? flatten(value, [...keys, key])
        : { [[...keys, key].join('.')]: value }),
    }),
    {}
  )
}
