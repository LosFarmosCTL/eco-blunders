import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongodb'

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
