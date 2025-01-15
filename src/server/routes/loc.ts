import { Request, Response } from 'express'
import { findAllLocations } from '../mongoCRUDs'
import { insertOneLocation } from '../mongoCRUDs'
import { Location } from '../../client/model/location'

export async function locGET(req: Request, res: Response) {
  console.log('get loc received')
  const locations = await findAllLocations()
  if (locations) {
    console.log('result found, sending locations')
    res.status(200).json(locations)
  } else {
    res.status(404).send(`Locations not found!`)
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
  if (result) {
    console.log('inserting location')
    res.status(200).json({
      id: result,
    })
  } else {
    res.status(404).send(`Location not found!`)
  }
}

export async function locPUT(req: Request, res: Response) {}

export async function locDELETE(req: Request, res: Response) {}

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
