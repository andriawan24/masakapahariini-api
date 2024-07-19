export interface RecipeResponse {
  image_url: string
  title: string
  cook_time: number
  level: string
  link: string
}

export interface DetailRecipeResponse {
  image_url: string
  title: string
  cook_time: number
  ingredients_total: number
  short_description: string
  ingredients: string[]
  instructions: string[]
}