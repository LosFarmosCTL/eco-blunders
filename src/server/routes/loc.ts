import path from 'path'
import { randomUUID } from 'crypto'

import { Request, Response, Router } from 'express'
import multer from 'multer'
import { ObjectId } from 'mongodb'

import { Location } from '../../shared/model/location'
import getDatabase from '../db'

const router = Router()
const storage = multer.diskStorage({
  destination: './public/media',
  filename: (_, file, cb) => {
    cb(null, randomUUID() + path.extname(file.originalname))
  },
})
const upload = multer({
  storage: storage,
})

router.get('/', async (_, res) => {
  const db = await getDatabase()
  const collection = db.collection<Location>('locations')

  const locations = await collection.find().toArray()
  res.status(200).json(locations)
})

router.get('/:id', async (req, res) => {
  const db = await getDatabase()
  const collection = db.collection<Location>('locations')

  const location = await collection.findOne({
    _id: new ObjectId(req.params.id),
  })

  if (location) {
    res.status(200).json(location)
  } else {
    res.status(404).send(`Location not found!`)
  }
})

router.post(
  '/',
  upload.fields([{ name: 'urls' }]),
  async (req: Request<unknown, unknown, UploadData>, res: Response) => {
    const files = req.files as Record<string, Express.Multer.File[] | undefined>
    const location = getLocationFromFormData(req.body, files)

    if (!validateLocation(location)) {
      res.status(400).send('Invalid location!')
      return
    }

    const db = await getDatabase()
    const locations = db.collection('locations')

    const result = await locations.insertOne(location)
    const newId = result.insertedId.toString()

    res.status(201).json({
      _id: newId,
      ...location,
    })
  },
)

router.put(
  '/:id',
  upload.fields([{ name: 'urls' }]),
  async (req: Request<{ id: string }, unknown, UploadData>, res: Response) => {
    const files = req.files as Record<string, Express.Multer.File[] | undefined>
    const location = getLocationFromFormData(req.body, files)

    if (!validateLocation(location)) {
      res.status(400).send('Invalid location!')
      return
    }

    const db = await getDatabase()
    const locations = db.collection('locations')

    const result = await locations.replaceOne(
      { _id: new ObjectId(req.params.id) },
      location,
    )

    if (result.modifiedCount == 0) {
      res.status(404).send(`Location not found`)
    } else {
      res.status(204).send()
    }
  },
)

// TODO: clean up uploaded images
router.delete('/:id', async (req, res) => {
  const db = await getDatabase()
  const locations = db.collection('locations')

  const result = await locations.deleteOne({ _id: new ObjectId(req.params.id) })

  if (result.deletedCount == 0) {
    res.status(404).send(`Location not found`)
  } else {
    res.status(204).send()
  }
})

export default router

function validateLocation(reqBody: unknown): reqBody is Omit<Location, 'id'> {
  return (
    typeof reqBody === 'object' &&
    reqBody !== null &&
    'name' in reqBody &&
    'description' in reqBody &&
    'lat' in reqBody &&
    'lon' in reqBody &&
    'address' in reqBody &&
    'street' in (reqBody as Omit<Location, 'id'>).address &&
    'zipcode' in (reqBody as Omit<Location, 'id'>).address &&
    'city' in (reqBody as Omit<Location, 'id'>).address &&
    'images' in reqBody &&
    'category' in reqBody &&
    'id' in (reqBody as Omit<Location, 'id'>).category &&
    'text' in (reqBody as Omit<Location, 'id'>).category &&
    'color' in (reqBody as Omit<Location, 'id'>).category &&
    'tags' in reqBody &&
    typeof reqBody.name === 'string' &&
    typeof (reqBody as Omit<Location, 'id'>).description === 'string' &&
    typeof (reqBody as Omit<Location, 'id'>).lat === 'string' &&
    typeof (reqBody as Omit<Location, 'id'>).lon === 'string' &&
    typeof (reqBody as Omit<Location, 'id'>).address === 'object' &&
    typeof (reqBody as Omit<Location, 'id'>).address.street === 'string' &&
    typeof (reqBody as Omit<Location, 'id'>).address.zipcode === 'string' &&
    typeof (reqBody as Omit<Location, 'id'>).address.city === 'string' &&
    Array.isArray((reqBody as Omit<Location, 'id'>).images) &&
    (reqBody as Omit<Location, 'id'>).images.every(
      (image) =>
        typeof image === 'object' &&
        'url' in image &&
        'alt' in image &&
        typeof image.url === 'string' &&
        typeof image.alt === 'string',
    ) &&
    typeof (reqBody as Omit<Location, 'id'>).category === 'object' &&
    typeof (reqBody as Omit<Location, 'id'>).category.id === 'string' &&
    typeof (reqBody as Omit<Location, 'id'>).category.text === 'string' &&
    typeof (reqBody as Omit<Location, 'id'>).category.color === 'string' &&
    Array.isArray((reqBody as Omit<Location, 'id'>).tags) &&
    (reqBody as Omit<Location, 'id'>).tags.every(
      (tag) =>
        typeof tag === 'object' &&
        'id' in tag &&
        'text' in tag &&
        'colorbg' in tag &&
        'color' in tag &&
        typeof tag.id === 'string' &&
        typeof tag.text === 'string' &&
        typeof tag.colorbg === 'string' &&
        typeof tag.color === 'string',
    )
  )
}

interface UploadData {
  name: string
  description: string
  lat: string
  lon: string
  street: string
  zipcode: string
  city: string
  category: {
    id: string
    text: string
    color: string
  }
  urls: string[] | undefined
  images: {
    alts: string[]
  }
  tags:
    | {
        id: string
        text: string
        colorbg: string
        color: string
      }[]
    | undefined
}

function getLocationFromFormData(
  body: UploadData,
  files: Record<string, Express.Multer.File[] | undefined>,
) {
  return {
    name: body.name,
    description: body.description,
    lat: body.lat,
    lon: body.lon,
    address: {
      street: body.street,
      zipcode: body.zipcode,
      city: body.city,
    },
    category: {
      id: body.category.id,
      text: body.category.text,
      color: body.category.color,
    },
    images: (body.urls ?? [])
      .map((url, index) => ({
        url,
        alt: body.images.alts[index],
      }))
      .concat(
        files.urls?.map((file, index) => ({
          url: `/media/${file.filename}`,
          alt: body.images.alts[index + (body.urls?.length ?? 0)],
        })) ?? [],
      ),
    tags: body.tags ?? [],
  }
}
