import { Request, Response } from 'express'
import {
  insertLocation,
  getLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} from '../mongoCRUDs'
import { Location } from '../../shared/model/location'
import { Tag } from '../../shared/model/tag'

export async function locGET(_: Request, res: Response) {
  const locations = await getLocations()
  res.status(200).json(locations)
}

export async function locGETOne(req: Request, res: Response) {
  const locationId = req.params.id
  const location = await getLocation(locationId)

  if (location) {
    res.status(200).json(location)
  } else {
    res.status(404).send(`Location not found!`)
  }
}

export async function locPOST(req: Request, res: Response) {
  if (!validateLocation(req.body)) {
    res.status(400).send('Invalid location!')
    return
  }

  const result = await insertLocation(req.body)

  res.status(201).json({
    id: result,
  })
}

export async function locPUT(req: Request, res: Response) {
  if (!validateLocation(req.body)) {
    res.status(400).send('Invalid location!')
    return
  }

  const result = await updateLocation(req.body)

  if (result) {
    res.status(204).send()
  } else {
    res.status(404).send(`Location not found!`)
  }
}

export async function locDELETE(req: Request, res: Response) {
  const result = await deleteLocation(req.params.id)

  if (result) {
    res.status(204)
    res.send()
  } else {
    res.status(404).send(`Location not found!`)
  }
}

function validateLocation(reqBody: unknown): reqBody is Location {
  return (
    typeof reqBody === 'object' &&
    reqBody !== null &&
    'id' in reqBody &&
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
    typeof (reqBody as Location).id === 'string' &&
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
