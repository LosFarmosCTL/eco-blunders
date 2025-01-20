/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config'
import { Db, MongoClient } from 'mongodb'
const user = process.env.DB_USER!
const password = process.env.DB_PASSWORD!
const database = process.env.DB_NAME!

const hostname = process.env.DB_HOSTNAME!
const port = process.env.DB_PORT!
const uri = `mongodb://${user}:${password}@${hostname}:${port}/${database}`

console.log(uri)

let client: MongoClient | null = null
let db: Db | null = null

export default async function getDatabase() {
  if (!client || !db) {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(database)
  }

  return db
}
