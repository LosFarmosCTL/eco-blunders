import './style.css'

import { getCookie, setCookie } from './util/cookies'
import { App } from './pages/app'
import { Login } from './pages/login'
import { User, UserRole } from '../shared/model/user'

const userCookie = getCookie('user')
const loggedInUser = parseUser(userCookie)

if (!loggedInUser) {
  document.body.replaceChildren(
    Login(async (user) => {
      setCookie(
        'user',
        `${user.username},${user.name},${user.role === UserRole.admin ? 'admin' : 'non-admin'}`,
      )
      await loadApp(user)
    }),
  )
} else {
  await loadApp(loggedInUser)
}

async function loadApp(user: User) {
  document.body.replaceChildren(await App(user))
}

function parseUser(cookie: string | null): User | null {
  if (!cookie) return null
  const parts = cookie.split(',')
  if (parts.length !== 3) return null

  const [username, name, role] = parts
  return {
    username,
    name,
    role: role === 'admin' ? UserRole.admin : UserRole.normal,
  }
}
