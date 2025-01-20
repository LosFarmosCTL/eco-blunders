import { Request, Response } from 'express'
import {
  insertOneLocation,
  findOneLocation,
  deleteOneLocation,
  findAllLocations,
  updateOneLocation,
} from '../mongoCRUDs'
import { Location } from '../../shared/model/location'

export async function locGET(req: Request, res: Response) {
  console.log('get loc received')
  const locations = await findAllLocations()
  console.log('result found, sending locations')
  res.status(200).json(locations)
}

export async function locGETOne(req: Request, res: Response) {
  console.log('get one loc received')
  const locid = req.params.id
  console.log('locid: ', locid)
  let location
  try {
    location = await findOneLocation(locid)
  } catch (e) {
    console.log(e)
    res.status(500)
    return
  }
  if (location) {
    res.status(200).json(location)
  } else {
    res.status(404).send(`Location not found!`)
  }
}

export async function locPOST(req: Request, res: Response) {
  console.log(req.body)
  if (!validateLocation(req.body)) {
    res.status(400).send('Invalid location!')
    return
  }
  const location = req.body
  const result = await insertOneLocation(location)
  console.log('inserting location')
  res.status(201).json({
    id: result,
  })
}

export async function locPUT(req: Request, res: Response) {
  console.log('updating one location')
  if (!validateLocation(req.body)) {
    res.status(400).send('Invalid location!')
    return
  }
  const location = req.body
  const result = await updateOneLocation(location)
  if (result) {
    res.status(204)
    res.send()
  } else {
    res.status(404).send(`Location not found!`)
  }
}

export async function locDELETE(req: Request, res: Response) {
  const locid = req.params.id
  console.log('deleting one location')
  const result = await deleteOneLocation(locid)
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
