import { h, Fragment } from '../../../../util/jsx/pragma'
import '../edit/edit.css'

import { Location } from '../../../../model/location'
import { TagList } from '../edit/components/tag-list'

interface DetailDialogProps {
  dialogRef: (dialog: HTMLDialogElement) => void
  location: Location
}

let imageContainer: HTMLDivElement | null = null
let activeImage: HTMLImageElement | null = null
const imageArray: HTMLImageElement[] = []
let currentImage = 1
let numberText: HTMLDivElement | null = null

function nextSlide(){
  const imageCount = imageArray.length
  if (currentImage == imageCount){
    return
  }
  currentImage++;
  //activeImage = imageArray[currentImage - 1]
  activeImage = imageArray[currentImage - 1]
  for (const image of imageArray){
    image.classList.add("hidden")
  }
  if (numberText) numberText.innerHTML = String(currentImage) + "/" + String(imageCount)
  activeImage.classList.remove("hidden")
}

function prevSlide(){
  const imageCount = imageArray.length
  if (currentImage == 1){
    return
  }
  if (imageCount == 1){
    return
  }
  currentImage--;
  activeImage = imageArray[currentImage - 1]
  for (const image of imageArray){
    image.classList.add("hidden")
  }
  if (numberText) numberText.innerHTML = String(currentImage) + "/" + String(imageCount)
  
  activeImage.classList.remove("hidden")

}

function getImages(){
  console.log("getImages called")
  if (imageArray.length > 0){
    return
  }
  //get all children of imageContainer as htmlelements
  const images = imageContainer?.children
  if (images){
    for (const image of images){
      if (image instanceof HTMLImageElement) {
        imageArray.push(image)
      }
    }
  }
}

function createImageElements(images: {url: string, alt: string}[]){
  const imageElements = []
  for (const image of images){
    imageElements.push(<img src={image.url} alt={image.alt} className="w-full h-full hidden"/>)
  }
  imageElements.at(0).classList.remove("hidden")
  return imageElements
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
            <div onLoad={() => {console.log("loaded")}} className="image-tag-container flex flex-col gap-10">
              <div ref={(elem) => imageContainer = elem}
               className="slideshow-container image-upload-container flex justify-center items-center relative aspect-square">
                <div ref={(elem) => numberText = elem} className="numbertext">1</div>
                {createImageElements(location.images)}
                <a className="prev" onClick={() => {
                  getImages()
                  prevSlide()
                }}   >❮</a>
                <a className="next" onClick={() => {
                  getImages()
                  nextSlide()
                }}>❯</a>
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
