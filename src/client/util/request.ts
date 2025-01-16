export async function request<Response>(
  url: string,
  config: RequestInit,
): Promise<Response> {
  const result = await fetch(url, config)
  console.log(result)
  if (result.status < 200 || result.status >= 300) {
    return { error: true } as Response
  }
  let jsonData
  try {
    //needed because if body is empty .json will throw an error
    jsonData = (await result.json()) as Response
  } catch (e) {
    console.log(e)
    return { empty: true } as Response
  }
  return jsonData
}
