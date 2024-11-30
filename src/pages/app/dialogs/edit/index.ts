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
  public async showModal() {
    this.dialog.showModal()

    await import('./OSM/location_script')
  }
}

interface Location {
  name: string
  description: string
  city: string
  postcode: string
  street: string
  lat: string
  lon: string
  tags: [
    {
      tag_text: string
      color: string
    },
  ]
  images: [ImageBitmap]
  // TODO: first version probably still needs changes
}
