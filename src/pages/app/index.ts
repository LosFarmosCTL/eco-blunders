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

  await loadDialogs()
}

const detailDialogHtmlURL = new URL(
  './dialogs/detail/detail.html',
  import.meta.url,
)

async function loadDialogs() {
  const { EditDialog } = await import('./dialogs/edit')
  const editDialog = new EditDialog()

  // TODO: extract to separate class as well
  await import('./dialogs/detail/detail.css')
  const detailDialog = document.createElement('dialog')
  const detailDialogHTML = await (await fetch(detailDialogHtmlURL)).text()
  detailDialog.innerHTML = detailDialogHTML
  detailDialog.id = 'detail-dialog'
  document.body.appendChild(detailDialog)

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  document.querySelector('#add-btn')?.addEventListener('click', async () => {
    await editDialog.load(null)
    await editDialog.show()

    // TODO: load+store input data
  })

  // TODO: set up detail/edit dialog
}
