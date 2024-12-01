import { createEmptyLocation, Location, pullLocationData } from './location'
import { Tag } from './tags/tag'
export class EditDialog {
  private readonly editDialogHtmlURL = new URL('./edit.html', import.meta.url)

  private dialog: HTMLDialogElement

  private currentLocation = createEmptyLocation()

  constructor() {
    this.dialog = document.createElement('dialog')
    this.dialog.id = 'add-dialog'
    this.dialog.addEventListener('cancel', (ev) => {
      ev.preventDefault()
      console.log('close detected')
    })
  }

  public async load(location: Location | null = null) {
    await import('./edit.css')
    this.dialog.innerHTML = await (await fetch(this.editDialogHtmlURL)).text()

    if (location === null) {
      this.styleNewLocation()
    }
    this.setupTagListeners()
    this.handleImageUpload()

    this.dialog
      .querySelector<HTMLInputElement>('input[name="name"]')
      ?.setAttribute('value', location?.name ?? '')

    // FIXME: should this be here?
    document.body.append(this.dialog)

    return this.dialog
  }

  // TODO: return edited data
  public async showModal(): Promise<Location> {
    this.dialog.showModal()
    await import('./OSM/location_script')

    return new Promise<Location>((resolve) => {
      this.dialog
        .querySelector('#submit-location')
        ?.addEventListener('click', (ev) => {
          ev.preventDefault()
          console.log('submit clicked')
          if (this.checkSubmitConditions()) {
            console.log(this.currentLocation)
            this.currentLocation = pullLocationData(this.currentLocation)
            this.dialog.close()
            resolve(this.currentLocation)
            return
          }
          this.errorStyling()
        })

      this.dialog
        .querySelector('#cancel-button')
        ?.addEventListener('click', () => {
          console.log('cancel clicked')
          this.dialog.close()
        })
    })
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

  private setupTagListeners() {
    let existingTags: number[] = []

    const tagSelector =
      this.dialog.querySelector<HTMLDivElement>('#tag-selector')?.children

    if (!tagSelector) return

    for (const elem of tagSelector) {
      if (elem.className === 'tag-selector-tag') {
        elem.addEventListener('click', () => {
          //create a new tag, see if it already exists
          const newTag = new Tag(elem.textContent ?? '')
          console.log(existingTags)
          if (existingTags.includes(newTag.id)) return

          //get the entire tag div and icon
          const tagElements = newTag.getTagElment()
          const completeTag = tagElements[0]
          const tagIcons = tagElements[1]
          existingTags.push(newTag.id)

          const checkmark = document.createElement('i')
          checkmark.classList.add('fa-solid', 'fa-check')

          //remove the tag and the id from the array
          tagIcons.addEventListener('click', () => {
            completeTag.remove()
            existingTags = existingTags.filter((tagID) => tagID !== newTag.id)
            elem.removeChild(checkmark)
            elem.classList.remove('tag-selector-checked')
          })

          //add the tag to the html
          const tagContainer =
            this.dialog.querySelector<HTMLDivElement>('#tag-container')
          tagContainer?.appendChild(completeTag)
          elem.appendChild(checkmark)
          elem.classList.add('tag-selector-checked')

          this.currentLocation.tags.push(newTag.text)
        })
      }
    }
  }
  private handleImageUpload() {
    const imageInput =
      this.dialog.querySelector<HTMLInputElement>('#image-upload')
    const testImage =
      document.body.querySelector<HTMLImageElement>('#image-test-id')

    imageInput?.addEventListener('change', async () => {
      console.log('image changed')
      const [image] = imageInput.files ?? []
      const reader = new FileReader()
      reader.onload = (e) => {
        //TODO: actually put the image somewhere useful right now just replaces a test image
        if (testImage) testImage.src = e.target?.result as string
        this.currentLocation.images.push({
          url: e.target?.result as string,
          alt: 'uploaded image',
        })
      }
      reader.readAsDataURL(image)
    })
  }

  private checkSubmitConditions(): boolean {
    const nameInput =
      this.dialog.querySelector<HTMLInputElement>('input[name="name"]')
    const descInput = this.dialog.querySelector<HTMLInputElement>(
      'input[name="description"]',
    )
    const latInput =
      this.dialog.querySelector<HTMLInputElement>('input[name="lat"]')
    const lonInput =
      this.dialog.querySelector<HTMLInputElement>('input[name="lon"]')
    const streetInput = this.dialog.querySelector<HTMLInputElement>(
      'input[name="street"]',
    )
    const zipInput = this.dialog.querySelector<HTMLInputElement>(
      'input[name="zipcode"]',
    )
    const cityInput =
      this.dialog.querySelector<HTMLInputElement>('input[name="city"]')

    if (nameInput?.value === '') return false
    if (descInput?.value === '') return false
    if (latInput?.value === '') return false
    if (lonInput?.value === '') return false
    if (streetInput?.value === '') return false
    if (zipInput?.value === '') return false
    if (cityInput?.value === '') return false

    return true
  }

  private errorStyling() {
    //TODO: make this better for the love of god
    alert('Please fill out all required fields')
  }
}
