import { MongoClient } from 'mongodb'
//import { ObjectId } from 'mongodb'
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
    console.log(`got:  + ${allRecords.length} locations from mongodb`)
    return allRecords
  } finally {
    await client.close()
  }
}

export async function findOneLocation(locid: number) {
  const client = new MongoClient(uri)
  try {
    const db = client.db(db_name)
    const location_collection = db.collection('locations')
    const query = { id: locid }
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
