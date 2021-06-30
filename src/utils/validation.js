export const isValidUrl = (url) => {
  try {
    const x = new URL(url)
    return x.protocol === 'http:' || x.protocol === 'https:'
  } catch {
    return false
  }
}
