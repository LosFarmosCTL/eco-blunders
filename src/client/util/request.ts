export async function request<Result = globalThis.Response>(
  url: string,
  config: RequestInit,
): Promise<[result: Result, response: Response]> {
  const result = await fetch(url, config)

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Request failed with status ${result.status.toString()}`)
  }

  if (result.status == 204 || result.status == 201) {
    return [{} as Result, result]
  }

  try {
    return [(await result.json()) as Result, result]
  } catch {
    throw new Error('Failed to parse JSON response')
  }
}
