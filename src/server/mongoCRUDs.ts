import { ObjectId } from 'mongodb'
import { saveImageInLocation } from './util/saveImage'
import getDatabase from './db'
import { User } from '../shared/model/user'
import { Location } from '../shared/model/location'

export async function getUser(
  username: string,
  password: string,
): Promise<User | null> {
  const db = await getDatabase()
  const users = db.collection<User>('users')

  return await users.findOne({
    username: username,
    password: password,
  })
}

export async function getLocations(): Promise<Location[]> {
  const db = await getDatabase()
  const locations = db.collection<Location>('locations')

  return await locations.find().toArray()
}

export async function getLocation(
  locationId: string,
): Promise<Location | null> {
  const db = await getDatabase()
  const locations = db.collection<Location>('locations')

  return await locations.findOne({ _id: new ObjectId(locationId) })
}

export async function insertLocation(location: Location): Promise<string> {
  location = saveImageInLocation(location)

  const db = await getDatabase()
  const locations = db.collection('locations')

  const result = await locations.insertOne(location)
  return result.insertedId.toString()
}

export async function updateLocation(location: Location): Promise<boolean> {
  const db = await getDatabase()
  const locations = db.collection('locations')

  const result = await locations.replaceOne(
    { _id: new ObjectId(location.id) },
    location,
  )
  return result.modifiedCount > 0
}

export async function deleteLocation(locationId: string): Promise<boolean> {
  const db = await getDatabase()
  const locations = db.collection('locations')

  const result = await locations.deleteOne({ _id: new ObjectId(locationId) })
  return result.deletedCount > 0
}
