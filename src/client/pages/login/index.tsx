import { h, Fragment } from '../../util/jsx/pragma'
import { User, UserRole } from '../../model/user'

import './login.css'

export function Login(onLogin: (user: User) => void) {
  let usernameInput: HTMLInputElement | null = null
  let passwordInput: HTMLInputElement | null = null

  function login() {
    const user = usernameInput?.value
    const pass = passwordInput?.value

    if (user == 'admina' && pass == 'password')
      onLogin({ login: 'admina', name: 'Admina', role: UserRole.admin })
    else if (user == 'normalo' && pass == 'password')
      onLogin({ login: 'normalo', name: 'Normalo', role: UserRole.normal })
    // TODO: build a nicer way to show an invalid login
    else alert('Invalid login!')
  }

  return (
    <>
      <div id="login">
        <div className="background-container flex flex-col justify-center gap-10">
          <div className="login-container flex">
            <div className="grow">
              <h1 className="text-center">ecoBlunders Berlin</h1>
            </div>
            <div className="grow">
              <form className="flex flex-col gap-10 w-full box-border">
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Username"
                  required
                  autoFocus
                  ref={(el) => {
                    usernameInput = el
                  }}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  ref={(el) => {
                    passwordInput = el
                  }}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-normal"
                    onClick={(e) => {
                      e.preventDefault()
                      login()
                    }}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          <footer className="login-footer flex justify-end">
            <ul className="flex gap-10 list-none">
              <a href="">
                <li>Privacy Policy</li>
              </a>
              <a href="">
                <li>Imprint</li>
              </a>
            </ul>
          </footer>
        </div>
      </div>
    </>
  )
}
