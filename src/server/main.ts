import express from 'express'
import ViteExpress from 'vite-express'
import { loginPOST } from './routes/login'
import { locGET, locGETOne, locPOST, locDELETE, locPUT } from './routes/loc'

const app = express()

app.use(express.json({ limit: '50mb' }))

app.get('/hello', (_, res) => {
  res.send('Hello World!')
})

app.get('/loc/:id', locGETOne)

app.post('/loc', locPOST)
app.get('/loc', locGET)
app.put('/loc/:id', locPUT)
app.delete('/loc/:id', locDELETE)

app.post('/login', loginPOST)

ViteExpress.listen(app, 3000, () => {
  console.log('Server is listening on port 3000...')
})
