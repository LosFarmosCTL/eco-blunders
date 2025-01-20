import { Request, Response } from 'express'
import {
  insertLocation,
  getLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} from '../mongoCRUDs'
import { Location } from '../../shared/model/location'

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
    'name' in reqBody &&
    'description' in reqBody &&
    'category' in reqBody &&
    'tags' in reqBody &&
    'address' in reqBody &&
    'lon' in reqBody &&
    'lat' in reqBody &&
    'images' in reqBody
  )
}
