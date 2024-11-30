export class EditDialog {
  private readonly editDialogHtmlURL = new URL('./edit.html', import.meta.url)

  private dialog: HTMLDialogElement

  constructor() {
    this.dialog = document.createElement('dialog')
    this.dialog.id = 'add-dialog'
  }

  public async load(location: Location | null = null) {
    await import('./edit.css')
    this.dialog.innerHTML = await (await fetch(this.editDialogHtmlURL)).text()

    this.dialog
      .querySelector<HTMLInputElement>('input[name="name"]')
      ?.setAttribute('value', location?.name ?? '')

    // FIXME: should this be here?
    document.body.append(this.dialog)

    return this.dialog
  }

  // TODO: return edited data
  public show() {
    this.dialog.showModal()
  }
}

interface Location {
  name: string
  // TODO: build a complete model and move it to an appropriate place
}
