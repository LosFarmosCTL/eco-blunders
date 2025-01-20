import { Router } from 'express'
import { ObjectId } from 'mongodb'

import { Location } from '../../shared/model/location'

import { saveImageInLocation } from '../util/saveImage'
import getDatabase from '../db'

const router = Router()

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

router.post('/', async (req, res) => {
  if (!validateLocation(req.body)) {
    res.status(400).send('Invalid location!')
    return
  }

  const location = saveImageInLocation(req.body)

  const db = await getDatabase()
  const locations = db.collection('locations')

  const result = await locations.insertOne(location)
  const newId = result.insertedId.toString()

  res.status(201).json({
    id: newId,
  })
})

router.put('/:id', async (req, res) => {
  if (!validateLocation(req.body)) {
    res.status(400).send('Invalid location!')
    return
  }

  const db = await getDatabase()
  const locations = db.collection('locations')

  const result = await locations.replaceOne(
    { _id: new ObjectId(req.params.id) },
    req.body,
  )

  if (result.modifiedCount == 0) {
    res.status(404).send(`Location not found`)
  } else {
    res.status(204).send()
  }
})

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

function validateLocation(reqBody: unknown): reqBody is Location {
  return (
    typeof reqBody === 'object' &&
    reqBody !== null &&
    'name' in reqBody &&
    'description' in reqBody &&
    'lat' in reqBody &&
    'lon' in reqBody &&
    'address' in reqBody &&
    'street' in (reqBody as Location).address &&
    'zipcode' in (reqBody as Location).address &&
    'city' in (reqBody as Location).address &&
    'images' in reqBody &&
    'category' in reqBody &&
    'id' in (reqBody as Location).category &&
    'text' in (reqBody as Location).category &&
    'color' in (reqBody as Location).category &&
    'tags' in reqBody &&
    typeof (reqBody as Location).name === 'string' &&
    typeof (reqBody as Location).description === 'string' &&
    typeof (reqBody as Location).lat === 'string' &&
    typeof (reqBody as Location).lon === 'string' &&
    typeof (reqBody as Location).address === 'object' &&
    typeof (reqBody as Location).address.street === 'string' &&
    typeof (reqBody as Location).address.zipcode === 'string' &&
    typeof (reqBody as Location).address.city === 'string' &&
    Array.isArray((reqBody as Location).images) &&
    (reqBody as Location).images.every(
      (image) =>
        typeof image === 'object' &&
        'url' in image &&
        'alt' in image &&
        typeof image.url === 'string' &&
        typeof image.alt === 'string',
    ) &&
    typeof (reqBody as Location).category === 'object' &&
    typeof (reqBody as Location).category.id === 'string' &&
    typeof (reqBody as Location).category.text === 'string' &&
    typeof (reqBody as Location).category.color === 'string' &&
    Array.isArray((reqBody as Location).tags) &&
    (reqBody as Location).tags.every(
      (tag) =>
        typeof tag === 'object' &&
        'id' in tag &&
        'text' in tag &&
        'color' in tag &&
        typeof tag.id === 'string' &&
        typeof tag.text === 'string' &&
        typeof tag.color === 'string',
    )
  )
}
