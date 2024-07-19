import { Router } from 'express'
import { getRecipeDetail, getRecipes, searchRecipes } from '../controllers/recipe_controllers'

const recipeRoutes = Router()

recipeRoutes.get('/recipes', getRecipes)
recipeRoutes.get('/recipes/search', searchRecipes)
recipeRoutes.get('/recipes/detail', getRecipeDetail)

export default recipeRoutes
