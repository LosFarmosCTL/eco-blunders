import './style.css'

import { getCookie, setCookie } from './util/cookies'

const loggedInUser = getCookie('user')
if (!loggedInUser) {
  const { Login } = await import('./pages/login')
  document.body.replaceChildren(
    Login(async (user) => {
      setCookie('user', user)
      await loadApp(user)
    }),
  )
} else {
  await loadApp(loggedInUser)
}

async function loadApp(user: string) {
  const { App } = await import('./pages/app')

  document.body.replaceChildren(await App(user))
}
