import { Request, Response } from 'express'
import { findAllLocations } from '../mongoCRUDs'
import { insertOneLocation } from '../mongoCRUDs'
export async function locGET(req: Request, res: Response) {
  console.log(req.body)
  const locations = await findAllLocations()
  if (locations) {
    console.log('result found, sending locations')
    res.status(200).json({
      locations: locations,
    })
  } else {
    res.status(404).send(`Locations not found!`)
  }
}

export async function locPOST(req: Request, res: Response) {
  console.log(req.body)
  const location = req.body
  const result = await insertOneLocation(location)
  if (result) {
    console.log('result found, sending location')
    res.status(200).json({
      id: result,
    })
  } else {
    res.status(404).send(`Location not found!`)
  }
}

export async function locPUT(req: Request, res: Response) {}

export async function locDELETE(req: Request, res: Response) {}
