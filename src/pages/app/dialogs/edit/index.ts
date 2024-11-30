import { Location } from './Location'
export class EditDialog {
  private readonly editDialogHtmlURL = new URL('./edit.html', import.meta.url)

  private dialog: HTMLDialogElement

  constructor() {
    this.dialog = document.createElement('dialog')
    this.dialog.id = 'add-dialog'
    this.dialog.addEventListener('close', () => {
      //TODO: closing via ESC is not preventable we can just direct it to do something
      console.log('close detected')
    })
  }

  public async load(location: Location | null = null) {
    await import('./edit.css')
    this.dialog.innerHTML = await (await fetch(this.editDialogHtmlURL)).text()

    if (location === null) {
      this.styleNewLocation()
    }

    this.dialog
      .querySelector<HTMLInputElement>('input[name="name"]')
      ?.setAttribute('value', location?.name ?? '')

    // FIXME: should this be here?
    document.body.append(this.dialog)

    return this.dialog
  }

  // TODO: return edited data
  public async showModal() {
    this.dialog.showModal()
    this.dialog
      .querySelector('#submit-location')
      ?.addEventListener('click', (ev) => {
        ev.preventDefault()
        console.log('submit clicked')
      })

    this.dialog
      .querySelector('#cancel-button')
      ?.addEventListener('click', () => {
        console.log('cancel clicked')
        this.dialog.close()
      })

    await import('./OSM/location_script')
    //TODO: do a promise resolve on click event here to return
  }

  private styleNewLocation() {
    console.log('load called with null')
    this.dialog
      .querySelector<HTMLButtonElement>('#delete-button')
      ?.classList.add('hidden')
    const submitButton =
      this.dialog.querySelector<HTMLButtonElement>('#submit-location')
    if (submitButton) submitButton.innerHTML = 'Submit Location'

    const buttondiv =
      this.dialog.querySelector<HTMLDivElement>('#dialog-buttons')
    if (buttondiv) {
      buttondiv.style.justifyContent = 'right'
    }
  }
}
