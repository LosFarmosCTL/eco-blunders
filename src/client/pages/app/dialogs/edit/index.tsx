import { h, Fragment } from '../../../../util/jsx/pragma'
import './edit.css'

import { Location } from '../../../../../shared/model/location'
import { Tag } from '../../../../../shared/model/tag'
import { Category } from '../../../../../shared/model/category'
import { TagSelector } from './components/tag-selector'
import { TagList } from './components/tag-list'

import { activateLocationScript } from './OSM/location_script'
import { ImageUpload } from './components/image-upload'
import { request } from '../../../../util/request'

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
  let uploadContainer: HTMLDivElement | null = null

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
  let selectedImages: { url: File | string; alt: string }[] =
    location?.images ?? []

  function cancel() {
    dialog?.close()
  }

  async function submitLocation() {
    if (checkSubmitConditions()) {
      const formData = new FormData()

      formData.append('name', nameInput?.value ?? '')
      formData.append('description', descInput?.value ?? '')
      formData.append('lat', latInput?.value ?? '')
      formData.append('lon', lonInput?.value ?? '')
      formData.append('street', streetInput?.value ?? '')
      formData.append('zipcode', zipInput?.value ?? '')
      formData.append('city', cityInput?.value ?? '')

      const category =
        categories.find((c) => c.id === categorySelect?.value) ?? categories[0]
      formData.append('category[id]', category.id)
      formData.append('category[text]', category.text)
      formData.append('category[color]', category.color)

      selectedImages.forEach((img, index) => {
        formData.append(`urls`, img.url)
        formData.append(`images[alts][${index.toString()}]`, img.alt)
      })
      selectedTags.forEach((tag, index) => {
        formData.append(`tags[${index.toString()}][id]`, tag.id)
        formData.append(`tags[${index.toString()}][text]`, tag.text)
        formData.append(`tags[${index.toString()}][colorbg]`, tag.colorbg)
        formData.append(`tags[${index.toString()}][color]`, tag.color)
      })

      try {
        if (location?.id) {
          await request(`/loc/${location.id}`, {
            method: 'PUT',
            body: formData,
          })

          location = await request<Location>(`/loc/${location.id}`, {
            method: 'GET',
          })
        } else {
          location = await request<Location>('/loc', {
            method: 'POST',
            body: formData,
          })
        }
      } catch {
        alert('Failed to update location')
        return
      }

      // HACK: sleep for 100ms, this is so the actual vite debug server has some
      // time to catch on to the new file being available, otherwise we'll just
      // get issues loading the image immediately
      await new Promise((resolve) => setTimeout(resolve, 100))

      dialog?.close()
      onEdit(location)
    }
  }

  function deleteLocation() {
    dialog?.close()
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

    return true
  }

  function addedImages(images: { url: string | File; alt: string }[]): void {
    selectedImages = images

    rerenderImageControl()
  }

  function removedImages(images: { url: string | File; alt: string }[]): void {
    selectedImages = images

    if (images.length == 0) {
      rerenderImageControl()
    }
  }

  function updateImages(images: { url: string | File; alt: string }[]): void {
    selectedImages = images
  }

  function rerenderImageControl() {
    uploadContainer?.replaceWith(
      <ImageUpload
        ref={(elem) => (uploadContainer = elem)}
        images={selectedImages}
        onAdd={addedImages}
        onRemove={removedImages}
        onUpdate={updateImages}
      />,
    )
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
              <ImageUpload
                ref={(elem) => (uploadContainer = elem)}
                images={selectedImages}
                onAdd={addedImages}
                onRemove={removedImages}
                onUpdate={updateImages}
              />
              <div className="custom-select">
                <h3 className="mb-5">Category</h3>
                <select
                  ref={(elem) => (categorySelect = elem)}
                  id="category-dropdown"
                >
                  {categories.map((category) => (
                    <option
                      selected={category.id === location?.category.id}
                      value={category.id}
                    >
                      {category.text}
                    </option>
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
                type="submit"
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
