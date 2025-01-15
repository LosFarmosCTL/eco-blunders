import { h, Fragment } from '../../../../../util/jsx/pragma'

interface ImageUploadProps {
  ref: (elem: HTMLDivElement) => void
  images: { url: string; alt: string }[]
  onAdd: (images: { url: string; alt: string }[]) => void
  onRemove: (images: { url: string; alt: string }[]) => void
  onUpdate: (images: { url: string; alt: string }[]) => void
}

export function ImageUpload({
  ref,
  images,
  onAdd,
  onRemove,
  onUpdate,
}: ImageUploadProps) {
  let currentImages = new Map(images.map((img) => [img.url, img.alt]))

  function updateImages(imageInput: HTMLInputElement) {
    Array.from(imageInput?.files ?? []).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const name = reader.result as string
        addImage(name)
      }
      reader.readAsDataURL(file)
    })
  }

  function addImage(url: string) {
    currentImages.set(url, currentImages.get(url) ?? '')

    onAdd(getImages())
  }

  function removeImage(url: string) {
    currentImages.delete(url)

    onRemove(getImages())
  }

  function updateImage(url: string, alt: string) {
    currentImages.set(url, alt)

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
        ref={(elem) => ref(elem!)}
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
              onChange={(e) => updateImages(e.target)}
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
                onChange={(e) => updateImages(e.target)}
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
  image: { url: string; alt: string }
  onUpdate: (url: string, alt: string) => void
  onRemove: (url: string) => void
}) {
  let container: HTMLDivElement | null = null

  return (
    <div
      ref={(elem) => (container = elem)}
      className="flex items-center gap-10"
    >
      <img
        className="upload-preview-image aspect-square"
        src={image.url}
        alt={image.alt}
      />
      <div className="flex justify-between items-center grow pr-10 gap-10">
        <input
          value={image.alt}
          placeholder="Image description"
          className="grow py-5"
          onChange={(e) => onUpdate(image.url, e.target.value)}
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
