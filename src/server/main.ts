import express from 'express'
import ViteExpress from 'vite-express'

import { transformMongoDbIdMiddleware } from './middleware/transformResponse'
import locationRoutes from './routes/loc'
import loginRoutes from './routes/login'

const app = express()
app.use(express.json())

app.use(transformMongoDbIdMiddleware)

app.use('/login', loginRoutes)
app.use('/loc', locationRoutes)

ViteExpress.listen(app, 3000, () => {
  console.log('Server is listening on port 3000...')
})
