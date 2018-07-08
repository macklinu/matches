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

export default is
