import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongodb'
import { Location } from '../client/model/location'
import { saveImageInLocation } from './util/saveImage'

// Replace db_user, db_pass, db_name, db_collection
const db_user = 'wad_bunke_petzel_bunke'
const db_pass = 'wLCEwvzze'
const db_name = 'wad_bunke_petzel'
//const users_collection = "users";
//const location_collection = "locations";
const dbHostname = 'mongodb1.f4.htw-berlin.de'
const dbPort = '27017'
const uri = `mongodb://${db_user}:${db_pass}@${dbHostname}:${dbPort}/${db_name}`

//TODO: rewrite as own functions and not fucking objects fuck objects
export async function findOneUser(uNameIn: string, passwdIn: string) {
  const client: MongoClient = new MongoClient(uri)
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
  const client = new MongoClient(uri)
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
  const client = new MongoClient(uri)
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
  const client = new MongoClient(uri)
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
  const client = new MongoClient(uri)
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
  const client = new MongoClient(uri)
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
