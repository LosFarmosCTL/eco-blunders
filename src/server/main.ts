import express from 'express'
import ViteExpress from 'vite-express'
import { loginPOST } from './routes/login'
import { locGET, locGETOne, locPOST, locDELETE, locPUT } from './routes/loc'
import { transformMongoDbIdMiddleware } from './middleware/transformResponse'

const app = express()

app.use(express.json())
app.use(transformMongoDbIdMiddleware)

app.get('/loc', locGET)
app.get('/loc/:id', locGETOne)
app.post('/loc', locPOST)
app.put('/loc/:id', locPUT)
app.delete('/loc/:id', locDELETE)

app.post('/login', loginPOST)

ViteExpress.listen(app, 3000, () => {
  console.log('Server is listening on port 3000...')
})
