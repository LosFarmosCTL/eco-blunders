export function setCookie(
  name: string,
  value: string,
  expires: Date | null = null,
) {
  document.cookie =
    `${name}=${value};` +
    (expires ? `expires=${expires.toUTCString()};` : '') +
    'path=/'
}

export function getCookie(name: string): string | null {
  const decodedCookies = decodeURIComponent(document.cookie)
  const cookies = decodedCookies.split(';')

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=')
    if (cookieName.trim() === name) {
      return cookieValue
    }
  }

  return null
}
