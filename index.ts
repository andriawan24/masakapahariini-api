import express from 'express'
import recipeRoutes from './src/routes/recipe_routes'
import { basicAuthMiddleware } from './src/middleware/basic_auth_middleware'

const app = express()
const port = 8080

app.use(express.json())
app.use(basicAuthMiddleware)
app.use('/api/v1', recipeRoutes)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
