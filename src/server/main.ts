import express from 'express'
import ViteExpress from 'vite-express'
import { loginPOST } from './routes/login'
import { locGET, locPOST } from './routes/loc'

const app = express()

app.use(express.json({ limit: '50mb' }))

app.get('/hello', (_, res) => {
  res.send('Hello World!')
})

app.post('/loc', locPOST)
app.get('/loc', locGET)

app.post('/login', loginPOST)

ViteExpress.listen(app, 3000, () => {
  console.log('Server is listening on port 3000...')
})
