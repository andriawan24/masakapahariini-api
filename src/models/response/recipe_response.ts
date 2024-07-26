export interface RecipeResponse {
  image_url: string
  title: string
  cook_time: number
  level: string
  link: string
}

export interface IngredientResponse {
  title: string;
  ingredients: IngredientItemResponse[]
}

interface IngredientItemResponse {
  quantity: string;
  name: string;
}

export interface DetailRecipeResponse {
  image_url: string
  title: string
  cook_time: number
  ingredients_total: number
  short_description: string
  ingredients: IngredientResponse[]
  instructions: string[]
}