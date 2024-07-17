import { Router } from 'express'
import { getRecipes, searchRecipes } from '../controllers/recipe_controllers'

const recipeRoutes = Router()

recipeRoutes.get('/recipes', getRecipes)
recipeRoutes.get('/recipes/search', searchRecipes)

export default recipeRoutes
