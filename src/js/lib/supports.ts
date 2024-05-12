export function testLocalStorage() {
  try {
    const t = "__storage_test__"
    const store = window.localStorage
    store.setItem(t, t)
    const v = store.getItem(t)
    store.removeItem(t)
    return t === v
  } catch {
    return false
  }
}
