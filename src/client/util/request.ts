export async function request<Response>(
  url: string,
  config: RequestInit,
): Promise<Response> {
  const result = await fetch(url, config)
  return result.json() as Response
}
