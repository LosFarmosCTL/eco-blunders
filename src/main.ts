import login from './pages/login'
import './style.css'

import { getCookie, setCookie } from './util/cookies'

let user = getCookie('user')
if (!user) {
  user = await login()
  setCookie('user', user)
}

const { default: loadApp } = await import('./pages/app')
await loadApp(user)
