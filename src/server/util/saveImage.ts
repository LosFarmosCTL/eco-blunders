import { Location } from '../../client/model/location'
import { writeFile } from 'fs/promises'

export function saveImageInLocation(loc: Location) {
  console.log('writing images to disk')
  loc.images.forEach(async (img, index) => {
    const matches = RegExp(/^data:(image\/\w+);base64,(.+)$/).exec(img.url)
    if (!matches) {
      return
    }
    const buffer = Buffer.from(matches[2], 'base64')
    let fileName = loc.name.replaceAll(' ', '_')
    fileName = fileName.replaceAll('/', '_')
    const filePath = `./public/media/${fileName}${index}.png`
    await writeFile(filePath, buffer)
    loc.images[index] = { url: filePath, alt: img.alt }
  })
  return loc
}
