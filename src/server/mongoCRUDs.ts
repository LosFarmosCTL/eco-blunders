import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongodb'
import { Location } from '../client/model/location'
import { saveImageInLocation } from './util/saveImage'

import 'dotenv/config'
const user = process.env.DB_USER!
const password = process.env.DB_PASSWORD!
const database = process.env.DB_NAME!

const hostname = process.env.DB_HOSTNAME!
const port = process.env.DB_PORT!
const uri = `mongodb://${user}:${password}@${hostname}:${port}/${database}`
const client: MongoClient = new MongoClient(uri)

export async function findOneUser(uNameIn: string, passwdIn: string) {
  try {
    const db = client.db(db_name)
    const users_collection = db.collection('users')
    const query = { username: uNameIn, password: passwdIn }
    const doc = await users_collection.findOne(query)
    if (doc) {
      delete doc.password
      return doc
    }
  } finally {
    await client.close()
  }
}

export async function findAllLocations() {
  try {
    const db = client.db(db_name)
    const location_collection = db.collection('locations')
    const query = {}
    const record_cursor =
      location_collection.find(query) /*eslint-disable-line*/
    const allRecords = []
    for await (const doc of record_cursor) {
      //console.log(doc)
      doc.id = doc._id
      allRecords.push(doc)
    }
    console.log(
      `got: ${allRecords.length} locations from mongodb` /*eslint-disable-line*/,
    )
    return allRecords
  } finally {
    await client.close()
  }
}

export async function findOneLocation(locid: string) {
  try {
    console.log('locid in mongo: ', locid)
    const objectId = new ObjectId(locid)
    const db = client.db(db_name)
    const location_collection = db.collection('locations')
    const query = { _id: objectId }
    const doc = await location_collection.findOne(query)
    return doc
  } finally {
    await client.close()
  }
}

export async function insertOneLocation(loc: Location) {
  loc = saveImageInLocation(loc)
  try {
    const db = client.db(db_name)
    const location_collection = db.collection('locations')
    const result = await location_collection.insertOne(loc)
    console.log(
      `Inserted location with the id ${result.insertedId}` /*eslint-disable-line*/,
    )
    return result.insertedId
  } finally {
    await client.close()
  }
}

export async function updateOneLocation(loc: Location) {
  try {
    const db = client.db(db_name)
    const location_collection = db.collection('locations')
    const objectId = new ObjectId(loc.id)
    const query = { _id: objectId }
    const result = await location_collection.replaceOne(query, loc)
    console.log(
      `Updated ${result.modifiedCount} location(s)` /*eslint-disable-line*/,
    ) /*eslint-disable-line*/
    if (result.modifiedCount > 0) {
      return true
    }
  } finally {
    await client.close()
  }
}

export async function deleteOneLocation(locid: string) {
  try {
    const db = client.db(db_name)
    const location_collection = db.collection('locations')
    const objectId = new ObjectId(locid)
    const query = { _id: objectId }
    const result = await location_collection.deleteOne(query)
    console.log(
      `Deleted ${result.deletedCount} location(s)` /*eslint-disable-line*/,
    ) /*eslint-disable-line*/
    if (result.deletedCount > 0) {
      return true
    }
  } finally {
    await client.close()
  }
}
