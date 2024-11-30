import './app.css'
import { setCookie } from '../../util/cookies'

const appHtmlURL = new URL('./app.html', import.meta.url)

export default async function loadApp(user: string) {
  console.log(user)

  const appHTML = await (await fetch(appHtmlURL)).text()
  document.body.innerHTML = appHTML

  document
    .querySelector<HTMLButtonElement>('#logout-btn')
    ?.addEventListener('click', () => {
      setCookie('user', '')
      window.location.reload()
    })
}
