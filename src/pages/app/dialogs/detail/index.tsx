import { h, Fragment } from '../../../../util/jsx/pragma'
import '../edit/edit.css'

import { Location } from '../../../../model/location'
import { TagList } from '../edit/components/tag-list'

interface DetailDialogProps {
  dialogRef: (dialog: HTMLDialogElement) => void
  location: Location
}

export function DetailDialog({ dialogRef, location }: DetailDialogProps) {
  let dialog: HTMLDialogElement | null = null

  return (
    <>
      <dialog
        ref={(diag) => {
          dialog = diag
          dialogRef(diag!)
        }}
      >
        <form className="flex flex-col">
          <h2 className="mb-5">Add a name</h2>
          <input
            className="readonly-input mb-10"
            name="name"
            placeholder="Name"
            value={location?.name ?? ''}
            tabIndex={1}
            autoComplete="off"
            readOnly
            autoFocus
          />
          <h2 className="mb-5">Add a description</h2>
          <div className="flex gap-10 mb-10">
            <div className="flex flex-col grow relative">
              <textarea
                className="readonly-input grow mb-10"
                name="description"
                placeholder="Description"
                defaultValue={location?.description ?? ''}
                tabIndex={2}
                readOnly
              />
              <div className="flex flex-col">
                <div className="flex gap-10 mb-10">
                  <input
                    className="readonly-input grow"
                    name="street"
                    placeholder="Street and Nr."
                    value={location?.address.street ?? ''}
                    readOnly
                    id="street-input"
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
                  />
                  <input
                    className="readonly-input grow"
                    name="city"
                    placeholder="City"
                    value={location?.address.city ?? ''}
                    readOnly
                    id="city-input"
                  />
                </div>
                <div className="flex gap-10 lat-long">
                  <input
                    className="readonly-input grow"
                    name="latitude"
                    placeholder="Latitude"
                    value={location?.lat ?? ''}
                    readOnly
                    id="lat-input"
                  />
                  <input
                    className="readonly-input grow"
                    name="longitude"
                    placeholder="Longitude"
                    value={location?.lon ?? ''}
                    readOnly
                    id="lon-input"
                  />
                </div>
              </div>
            </div>
            <div className="image-tag-container flex flex-col gap-10">
              <div className="image-upload-container flex justify-center items-center relative aspect-square">
                <img
                  className="w-full h-full"
                  src={location.images[0].url}
                  alt={location.images[0].alt}
                />
              </div>
              <div className="custom-select">
                <h3 className="mb-5">Category</h3>
                <select disabled>
                  <option selected>{location.category.text}</option>
                </select>
              </div>
              <div className="tag-container" id="tag-container">
                <h3 className="mb-5">Tags</h3>
                <TagList
                  tags={location.tags}
                  overlay={false}
                  onDelete={() => {}}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-10">
            <button
              type="button"
              className="btn-normal"
              tabIndex={5}
              onClick={() => dialog?.close()}
            >
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
