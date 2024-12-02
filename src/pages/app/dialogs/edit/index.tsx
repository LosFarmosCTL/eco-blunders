import { h, Fragment } from '../../../../util/jsx/pragma'
import './edit.css'

import { Location } from '../../../../model/location'
import { Tag } from '../../../../model/tag'
import { Category } from '../../../../model/category'
import { TagSelector } from './components/tag-selector'
import { TagList } from './components/tag-list'

import { activateLocationScript } from './OSM/location_script'

interface EditDialogProps {
  dialogRef: (dialog: HTMLDialogElement) => void
  location: Location | null
  tags: Tag[]
  categories: Category[]
  onEdit: (location: Location) => void
  onDelete: (location: Location) => void
}

export function EditDialog({
  dialogRef,
  location,
  tags,
  categories,
  onEdit,
  onDelete,
}: EditDialogProps) {
  let dialog: HTMLDialogElement | null = null
  let tagSelector: HTMLElement | null = null
  let tagList: HTMLElement | null = null

  let nameInput: HTMLInputElement | null = null
  let descInput: HTMLTextAreaElement | null = null
  let searchInput: HTMLInputElement | null = null
  let streetInput: HTMLInputElement | null = null
  let zipInput: HTMLInputElement | null = null
  let cityInput: HTMLInputElement | null = null
  let latInput: HTMLInputElement | null = null
  let lonInput: HTMLInputElement | null = null
  let categorySelect: HTMLSelectElement | null = null

  let selectedTags: Tag[] = location?.tags ?? []

  function cancel() {
    dialog?.close()
  }

  function submitLocation() {
    if (checkSubmitConditions()) {
      location = {
        id: location?.id ?? crypto.randomUUID(),
        name: nameInput?.value ?? '',
        description: descInput?.value ?? '',
        lat: latInput?.value ?? '',
        lon: lonInput?.value ?? '',
        address: {
          street: streetInput?.value ?? '',
          zipcode: zipInput?.value ?? '',
          city: cityInput?.value ?? '',
        },
        images: location?.images ?? [],
        category:
          categories.find((c) => c.id === categorySelect?.value) ??
          categories[0],
        tags: selectedTags,
      }
      dialog?.close()
      onEdit(location)
      return
    }
  }

  function deleteLocation() {
    onDelete(location!)
  }

  function updateTagSelector() {
    tagSelector?.replaceWith(
      <TagSelector
        ref={(elem) => (tagSelector = elem)}
        tags={tags}
        selectedTags={selectedTags}
        addTag={addTag}
      ></TagSelector>,
    )
  }

  function updateTagList() {
    tagList?.replaceChildren(
      <TagList tags={selectedTags} overlay onDelete={removeTag} />,
    )
  }

  function addTag(tag: Tag) {
    selectedTags.push(tag)

    updateTagSelector()
    updateTagList()
  }

  function removeTag(tag: Tag) {
    selectedTags = selectedTags.filter((t) => t.id != tag.id)

    updateTagSelector()
    updateTagList()
  }

  function checkSubmitConditions(): boolean {
    if (nameInput?.value === '') {
      nameInput.setCustomValidity('Please set a name.')
      nameInput.reportValidity()
      return false
    }

    if (
      streetInput?.value === '' ||
      zipInput?.value === '' ||
      cityInput?.value === '' ||
      latInput?.value === '' ||
      lonInput?.value === ''
    ) {
      searchInput?.setCustomValidity(
        'Please choose a location from the search list.',
      )
      searchInput?.reportValidity()
      return false
    }
    /*
    if (streetInput?.value === '') {
      searchInput?.setCustomValidity(
        'Please choose a location from the search list.',
      )
      searchInput?.reportValidity()
      return false
    }

    if (zipInput?.value === '') {
      searchInput?.setCustomValidity('Please choose a location from the serach list.')
      searchInput?.reportValidity()
      return false
    }

    if (cityInput?.value === '') {
      searchInput?.setCustomValidity('Please choose a location from the serach list.')
      searchInput?.reportValidity()
      return false
    }

    if (latInput?.value === '') {
      searchInput?.setCustomValidity('Please choose a location from the serach list.')
      searchInput?.reportValidity()
      return false
    }

    if (lonInput?.value === '') {
      searchInput?.setCustomValidity('Please choose a location from the serach list.')
      searchInput?.reportValidity()
      return false
    }
*/
    return true
  }

  return (
    <>
      <dialog
        ref={(diag) => {
          dialog = diag
          dialogRef(diag!)
        }}
        onCancel={(e) => {
          e.preventDefault()
        }}
      >
        <form className="flex flex-col">
          <h2 className="mb-5">Add a name</h2>
          <input
            className="mb-10"
            name="name"
            placeholder="Name"
            value={location?.name ?? ''}
            tabIndex={1}
            autoComplete="off"
            required
            autoFocus
            ref={(elem) => (nameInput = elem)}
          />
          <h2 className="mb-5">Add a description</h2>
          <div className="flex gap-10 mb-10">
            <div className="flex flex-col grow relative">
              <textarea
                className="grow mb-10"
                name="description"
                placeholder="Description"
                defaultValue={location?.description ?? ''}
                tabIndex={2}
                required
                ref={(elem) => (descInput = elem)}
              />
              <div className="flex flex-col">
                <input
                  className="mb-10"
                  name="adressSearch"
                  placeholder="Search address..."
                  tabIndex={4}
                  autoComplete="off"
                  onInput={(ev) => {
                    activateLocationScript(ev)
                  }}
                  ref={(elem) => (searchInput = elem)}
                />
                <div
                  className="hidden list-none osm-list "
                  id="loc_autocomplete"
                ></div>
                <div className="flex gap-10 mb-10">
                  <input
                    className="readonly-input grow"
                    name="street"
                    placeholder="Street and Nr."
                    value={location?.address.street ?? ''}
                    readOnly
                    id="street-input"
                    ref={(elem) => (streetInput = elem)}
                  />
                </div>
                <div className="flex gap-10 mb-10">
                  <input
                    className="readonly-input "
                    name="zipcode"
                    placeholder="ZIP Code"
                    value={location?.address.zipcode ?? ''}
                    readOnly
                    id="zip-input"
                    ref={(elem) => (zipInput = elem)}
                  />
                  <input
                    className="readonly-input grow"
                    name="city"
                    placeholder="City"
                    value={location?.address.city ?? ''}
                    readOnly
                    id="city-input"
                    ref={(elem) => (cityInput = elem)}
                  />
                </div>
                <div className="flex gap-10 lat-long">
                  <input
                    className="readonly-input"
                    name="latitude"
                    placeholder="Latitude"
                    value={location?.lat ?? ''}
                    readOnly
                    id="lat-input"
                    ref={(elem) => (latInput = elem)}
                  />
                  <input
                    className="readonly-input"
                    name="longitude"
                    placeholder="Longitude"
                    value={location?.lon ?? ''}
                    readOnly
                    id="lon-input"
                    ref={(elem) => (lonInput = elem)}
                  />
                </div>
              </div>
            </div>
            <div className="image-tag-container flex flex-col gap-10">
              <div className="image-upload-container flex justify-center items-center relative aspect-square">
                <div className="flex flex-col items-center">
                  <input
                    className="upload-input"
                    type="file"
                    accept="image/*"
                    tabIndex={3}
                    multiple
                  />
                  <span className="mb-10 text-3xl fa-solid fa-upload" />
                  <span>Add Images</span>
                </div>
              </div>
              <div className="custom-select">
                <h3 className="mb-5">Category</h3>
                <select
                  ref={(elem) => (categorySelect = elem)}
                  id="category-dropdown"
                >
                  {categories.map((category) => (
                    <option value={category.id}>{category.text}</option>
                  ))}
                </select>
              </div>
              <div className="tag-container" id="tag-container">
                <h3 className="mb-5">Tags</h3>
                <span ref={(elem) => (tagList = elem)}>
                  <TagList tags={selectedTags} overlay onDelete={removeTag} />
                </span>
                <details
                  className="details-modal inline"
                  tabIndex={7}
                  onToggle={(e) => {
                    if ((e.target as HTMLDetailsElement).open)
                      updateTagSelector()
                  }}
                >
                  <summary className="inline list-none" tabIndex={-1}>
                    <div className="tag tag-add">+ add</div>
                  </summary>
                  <TagSelector
                    ref={(elem) => (tagSelector = elem)}
                    addTag={addTag}
                    tags={tags}
                    selectedTags={selectedTags}
                  />
                </details>
              </div>
            </div>
          </div>
          {location ?
            <div className="flex justify-between" id="dialog-buttons">
              <button
                type="button"
                className="btn-destructive"
                tabIndex={6}
                onClick={deleteLocation}
              >
                Delete
              </button>
              <div className="flex gap-10">
                <button
                  type="button"
                  className="btn-normal"
                  tabIndex={5}
                  onClick={cancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-positive"
                  tabIndex={4}
                  onClick={submitLocation}
                >
                  Update
                </button>
              </div>
            </div>
          : <div className="flex justify-end gap-10">
              <button
                type="button"
                className="btn-normal"
                tabIndex={5}
                onClick={cancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-positive"
                tabIndex={4}
                onClick={submitLocation}
              >
                Add Location
              </button>
            </div>
          }
        </form>
      </dialog>
    </>
  )
}

export class EditDialogClass {
  //private handleImageUpload() {
  //  const imageInput =
  //    this.dialog.querySelector<HTMLInputElement>('#image-upload')
  //  const testImage =
  //    document.body.querySelector<HTMLImageElement>('#image-test-id')
  //
  //  imageInput?.addEventListener('change', async () => {
  //    console.log('image changed')
  //    const [image] = imageInput.files ?? []
  //    const reader = new FileReader()
  //    reader.onload = (e) => {
  //      // TODO: actually put the image somewhere useful right now just replaces a test image
  //      if (testImage) testImage.src = e.target?.result as string
  //      this.currentLocation.images.push({
  //        url: e.target?.result as string,
  //        alt: 'uploaded image',
  //      })
  //    }
  //    reader.readAsDataURL(image)
  //  })
  //}
  //private checkSubmitConditions(): boolean {
  //  const nameInput = this.dialog.querySelector<HTMLInputElement>('#name-input')
  //  const latInput = this.dialog.querySelector<HTMLInputElement>('#lat-input')
  //  const lonInput = this.dialog.querySelector<HTMLInputElement>('#lon-input')
  //  const streetInput =
  //    this.dialog.querySelector<HTMLInputElement>('#street-input')
  //  const zipInput = this.dialog.querySelector<HTMLInputElement>('#zip-input')
  //  const cityInput = this.dialog.querySelector<HTMLInputElement>('#city-input')
  //  const searchInput =
  //    this.dialog.querySelector<HTMLInputElement>('#search-input')
  //
  //  if (nameInput?.value === '') {
  //    console.log('name is empty' + nameInput.value)
  //    nameInput.setCustomValidity('Please set a name.')
  //    nameInput.reportValidity()
  //    return false
  //  }
  //  nameInput?.setCustomValidity('')
  //  if (streetInput?.value === '') {
  //    searchInput?.setCustomValidity(
  //      'Please choose a location from the search list.',
  //    )
  //    searchInput?.reportValidity()
  //    return false
  //  }
  //  streetInput?.setCustomValidity('')
  //  if (zipInput?.value === '') {
  //    console.log('zip is empty' + zipInput.value)
  //    zipInput.setCustomValidity('Please set a zipcode.')
  //    zipInput.reportValidity()
  //    return false
  //  }
  //  if (cityInput?.value === '') {
  //    console.log('city is empty' + cityInput.value)
  //    cityInput.setCustomValidity('Please set a city.')
  //    cityInput.reportValidity()
  //    return false
  //  }
  //  if (latInput?.value === '') {
  //    console.log('lat is empty' + latInput.value)
  //    latInput.setCustomValidity(
  //      'Please set a latitude by choosing a location from the list.',
  //    )
  //    latInput.reportValidity()
  //    return false
  //  }
  //  if (lonInput?.value === '') {
  //    console.log('lon is empty' + lonInput.value)
  //    lonInput.setCustomValidity(
  //      'Please set a longitude by choosing a location from the list.',
  //    )
  //    lonInput.reportValidity()
  //    return false
  //  }
  //
  //  console.log('all fields filled out')
  //  return true
  //}
}
