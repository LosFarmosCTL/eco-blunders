export async function request<Response>(
  url: string,
  config: RequestInit,
): Promise<Response> {
  const result = await fetch(url, config)
  if (result.status != 200) {
    return null as Response
  }
  return result.json() as Response
}
