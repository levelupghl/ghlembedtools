export function addQueryParam(
  url: string,
  paramName: string,
  paramValue: string
): string {
  try {
    // Create a URL object from the given string
    const urlObj = new URL(url)

    // Set the query parameter
    urlObj.searchParams.set(paramName, paramValue)

    // Return the updated URL string
    return urlObj.toString()
  } catch (error) {
    // Handle potential errors, such as invalid URL format
    console.error("Provided string is not a valid URL:", error)
    // Return the original url
    return url
  }
}

export function getQueryParams(
  url_or_search: string | null = null
): Record<string, string> {
  let search: string
  if (url_or_search) {
    search = url_or_search.startsWith("?")
      ? url_or_search
      : new URL(url_or_search).search
  } else {
    search = window.location.search || new URL(window.location.href).search
  }
  const params = new URLSearchParams(search)
  const queryParams: Record<string, string> = {}
  params.forEach((value, key) => {
    queryParams[key] = value
  })
  return queryParams
}

// Merge and array of objects into a single object
export function mergeObjects(
  objects: Record<string, any>[]
): Record<string, any> {
  const result: Record<string, any> = {}
  // Iterate through each object in the array
  objects.forEach((obj) => {
    // Iterate through each key in the current object
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Assign/overwrite the property in the result object
        result[key] = obj[key]
      }
    }
  })
  return result
}
