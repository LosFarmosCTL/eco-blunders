import './app.css'
import { setCookie } from '../../util/cookies'
import { EditDialog } from './dialogs/edit'

const appHtmlURL = new URL('./app.html', import.meta.url)

export class App {
  private readonly user: string

  constructor(user: string) {
    this.user = user
    console.log(user)
  }

  public async load() {
    const appHTML = await (await fetch(appHtmlURL)).text()
    document.body.innerHTML = appHTML

    document
      .querySelector<HTMLButtonElement>('#logout-btn')
      ?.addEventListener('click', () => {
        setCookie('user', '')
        window.location.reload()
      })

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
      await addLocation(editDialog)
    })

    async function addLocation(dialog: EditDialog) {
      await dialog.load(null)
      console.log(await dialog.showModal())

      // TODO: load+store input data
    }
  }
}

const detailDialogHtmlURL = new URL(
  './dialogs/detail/detail.html',
  import.meta.url,
)
