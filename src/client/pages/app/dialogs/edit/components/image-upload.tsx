import { h, Fragment } from '../../../../../util/jsx/pragma'

interface ImageUploadProps {
  ref: (elem: HTMLDivElement) => void
  images: { url: File | string; alt: string }[]
  onAdd: (images: { url: File | string; alt: string }[]) => void
  onRemove: (images: { url: File | string; alt: string }[]) => void
  onUpdate: (images: { url: File | string; alt: string }[]) => void
}

export function ImageUpload({
  ref,
  images,
  onAdd,
  onRemove,
  onUpdate,
}: ImageUploadProps) {
  const currentImages = new Map(images.map((img) => [img.url, img.alt]))

  function updateImages(imageInput: HTMLInputElement) {
    Array.from(imageInput.files ?? []).forEach((file) => {
      addImage(file)
    })
  }

  function addImage(image: File | string) {
    currentImages.set(image, currentImages.get(image) ?? '')

    onAdd(getImages())
  }

  function removeImage(image: File | string) {
    currentImages.delete(image)

    onRemove(getImages())
  }

  function updateImage(image: File | string, alt: string) {
    currentImages.set(image, alt)

    onUpdate(getImages())
  }

  function getImages() {
    return Array.from(currentImages).map((keyVal) => {
      return { url: keyVal[0], alt: keyVal[1] }
    })
  }

  return (
    <>
      <div
        ref={(elem) => {
          ref(elem!)
        }}
        className={
          images.length == 0 ?
            'image-upload-container flex justify-center items-center relative aspect-square'
          : 'flex flex-col gap-10'
        }
      >
        {images.length == 0 ?
          <div className="flex flex-col items-center">
            <input
              className="upload-input"
              type="file"
              accept="image/*"
              tabIndex={3}
              multiple
              onChange={(e) => {
                updateImages(e.target)
              }}
            />
            <span className="mb-10 text-3xl fa-solid fa-upload" />
            <span>Add Images</span>
          </div>
        : <div className="flex flex-col gap-10">
            {images.map((img) => (
              <Image
                image={img}
                onUpdate={updateImage}
                onRemove={removeImage}
              />
            ))}
            <div className="image-upload-container flex justify-center items-center gap-10 w-full relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="upload-input cursor-pointer"
                tabIndex={3}
                multiple
                onChange={(e) => {
                  updateImages(e.target)
                }}
              />
              <span className="text-xl fa-solid fa-upload"></span>
              <span>Add more Images</span>
            </div>
          </div>
        }
      </div>
    </>
  )
}

function Image({
  image,
  onUpdate,
  onRemove,
}: {
  image: { url: File | string; alt: string }
  onUpdate: (file: File | string, alt: string) => void
  onRemove: (file: File | string) => void
}) {
  let container: HTMLDivElement | null = null
  const imageUrl =
    typeof image.url === 'string' ? image.url : URL.createObjectURL(image.url)

  return (
    <div
      ref={(elem) => (container = elem)}
      className="flex items-center gap-10"
    >
      <img
        className="upload-preview-image aspect-square"
        src={imageUrl}
        alt={image.alt}
      />
      <div className="flex justify-between items-center grow pr-10 gap-10">
        <input
          value={image.alt}
          placeholder="Image description"
          className="grow py-5"
          onChange={(e) => {
            onUpdate(image.url, e.target.value)
          }}
        />
        <span
          className="fa-solid fa-trash-can cursor-pointer"
          onClick={() => {
            onRemove(image.url)
            container?.remove()
          }}
        ></span>
      </div>
    </div>
  )
}
