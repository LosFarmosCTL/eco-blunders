import { Location } from '../../shared/model/location'
import { writeFile } from 'fs/promises'

// TODO: find a better way to do this instead of passing around the Location object
export function saveImageInLocation(loc: Location) {
  loc.images.forEach(async (img, index) => {
    const imageBuffer = Buffer.from(img.url.split(',')[1], 'base64')

    const fileName = loc.name
      .replaceAll(' ', '_')
      .replaceAll('/', '_')
      .concat(index.toString())
      .concat('.png')

    const filePath = `/media/${fileName}`
    await writeFile(`./public${filePath}`, imageBuffer)

    loc.images[index] = { url: filePath, alt: img.alt }
  })

  return loc
}
