export async function request<Response = void>(
  url: string,
  config: RequestInit,
): Promise<Response> {
  const result = await fetch(url, config)

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Request failed with status ${result.status.toString()}`)
  }

  if (result.status == 204) {
    return {} as Response
  }

  try {
    return (await result.json()) as Response
  } catch {
    throw new Error('Failed to parse JSON response')
  }
}
