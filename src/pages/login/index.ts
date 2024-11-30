import './login.css'
const loginHtmlURL = new URL('./login.html', import.meta.url)

export default async function loadLogin(): Promise<string> {
  const loginHTML = await (await fetch(loginHtmlURL)).text()
  document.body.innerHTML = loginHTML

  return new Promise<string>((resolve) => {
    const loginForm = document.querySelector<HTMLFormElement>('#login-form')

    document
      .querySelector<HTMLButtonElement>('#login-btn')
      ?.addEventListener('click', (e) => {
        e.preventDefault()

        const user = loginForm?.querySelector<HTMLInputElement>(
          'input[name="username"]',
        )?.value
        const pass = loginForm?.querySelector<HTMLInputElement>(
          'input[name="password"]',
        )?.value

        if (user == 'admina' && pass == 'password') resolve('admina')
        else if (user == 'normalo' && pass == 'password') resolve('normalo')
        else invalidLogin()
      })
  })
}

function invalidLogin() {
  // TODO: build a nicer way to show an invalid login
  alert('Invalid login!')
}
