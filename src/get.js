export default function get(obj, path, fallback = undefined) {
  return (
    path.split('.').reduce((a, b) => (a && a[b] ? a[b] : null), obj) || fallback
  )
}
