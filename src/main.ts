import './style.css'

import { getCookie, setCookie } from './util/cookies'
import { App } from './pages/app'
import { Login } from './pages/login'

const loggedInUser = getCookie('user')
if (!loggedInUser) {
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
  document.body.replaceChildren(await App(user))
}
